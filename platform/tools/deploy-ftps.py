#!/usr/bin/env python3
"""Explicit FTPS upload + ready marker + cron activation acknowledgement."""
import ftplib
import hashlib
import io
import os
from pathlib import Path
import re
import ssl
import time

FILES = {
    'luxurry-staging.tar.gz': 'staging-release/luxurry-staging.tar.gz',
    'SHA256SUMS': 'staging-release/SHA256SUMS',
    'activate-release.sh': 'platform/deploy/activate-release.sh',
    'front-controller.php': 'platform/deploy/front-controller.php',
}

class ReusingFTP_TLS(ftplib.FTP_TLS):
    # Some cPanel FTP servers require data connections to reuse the TLS session.
    def ntransfercmd(self, cmd, rest=None):
        connection, size = ftplib.FTP.ntransfercmd(self, cmd, rest)
        if self._prot_p:
            connection = self.context.wrap_socket(connection, server_hostname=self.host, session=self.sock.session)
        return connection, size

def connection():
    host = os.environ.get('FTP_SERVER', '')
    port = os.environ.get('FTP_PORT', '21')
    if not re.fullmatch(r'[A-Za-z0-9.-]+', host) or not port.isdigit() or not 1 <= int(port) <= 65535:
        raise ValueError('Set FTP_SERVER to the certificate-matching hostname and FTP_PORT to its explicit FTPS port.')
    user, password = os.environ.get('FTP_USERNAME'), os.environ.get('FTP_PASSWORD')
    if not user or not password:
        raise ValueError('FTP_USERNAME and FTP_PASSWORD secrets are required.')
    context = ssl.create_default_context()
    context.minimum_version = ssl.TLSVersion.TLSv1_2
    ftp = ReusingFTP_TLS(context=context, timeout=45)
    try:
        ftp.connect(host, int(port))
        ftp.login(user, password)
        ftp.prot_p()
        ftp.set_pasv(True)
        ftp.cwd('/')
        return ftp
    except BaseException:
        ftp.close()
        raise

def read_text(ftp, path, limit=1024):
    data = bytearray()
    def chunk(value):
        data.extend(value)
        if len(data) > limit:
            raise ValueError('Unexpectedly large deployment acknowledgement.')
    ftp.retrbinary('RETR '+path, chunk)
    return bytes(data).decode('ascii').strip()

def upload(ftp, release, files=FILES):
    if not re.fullmatch(r'[0-9a-f]{40}-[0-9]{1,16}-[0-9]{1,6}', release):
        raise ValueError('Invalid GitHub release identifier.')
    if read_text(ftp, 'AGENT_READY') != 'luxurry-ftps-agent-v1':
        raise ValueError('Install and check the cPanel deployment agent before enabling deployment.')
    ftp.mkd(release)  # A repeated attempt never overwrites an existing submission.
    manifest=[]
    for remote, local in files.items():
        data=Path(local).read_bytes()
        manifest.append(f'{hashlib.sha256(data).hexdigest()}  {remote}\n')
        ftp.storbinary(f'STOR {release}/{remote}.part', io.BytesIO(data))
        ftp.rename(f'{release}/{remote}.part', f'{release}/{remote}')
    ftp.storbinary(f'STOR {release}/DEPLOY.SHA256.part', io.BytesIO(''.join(manifest).encode('ascii')))
    ftp.rename(f'{release}/DEPLOY.SHA256.part', f'{release}/DEPLOY.SHA256')
    # Cron ignores partial directories until this final atomic marker rename.
    ftp.storbinary(f'STOR {release}/READY.part', io.BytesIO((release+'\n').encode('ascii')))
    ftp.rename(f'{release}/READY.part', f'{release}/READY')

def wait_for_activation(release, connect=connection, timeout=900, interval=15, clock=time.monotonic, pause=time.sleep):
    deadline=clock()+timeout
    while clock()<deadline:
        ftp=None
        try:
            ftp=connect()
            try:state=read_text(ftp, f'{release}/STATUS')
            except ftplib.error_perm as error:
                if not str(error).startswith('550'):raise
                state='queued'
            if state=='succeeded':
                print('Cron activation and new-release HTTP checks succeeded.')
                return
            if state in ('failed','rejected','superseded'):
                raise RuntimeError(f'Deployment {state}. Check the private host deployment log.')
            if state not in ('queued','running'):
                raise RuntimeError('Unrecognized activation status.')
        except (OSError, EOFError, ftplib.error_temp):
            # A transient connection failure is not an activation success.
            pass
        finally:
            if ftp is not None:ftp.close()
        pause(interval)
    raise TimeoutError('No successful activation acknowledgement within 15 minutes. Check cPanel cron and private logs; do not assume deployment stopped.')

def main():
    release='-'.join(os.environ.get(k,'') for k in ('GITHUB_SHA','GITHUB_RUN_ID','GITHUB_RUN_ATTEMPT'))
    ftp=connection()
    try:upload(ftp, release)
    finally:ftp.close()
    print('Release uploaded. Waiting for cPanel cron activation...')
    wait_for_activation(release)

if __name__=='__main__':main()
