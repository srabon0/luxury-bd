#!/usr/bin/env python3
"""Upload a tested archive and activate it through a verified SSH connection."""
import os
from pathlib import Path
import re
import shlex
import subprocess

def required(name):
    value = os.environ.get(name, '')
    if not value:
        raise ValueError(f'Missing deployment setting: {name}')
    return value

def main():
    host, user = required('DEPLOY_HOST'), required('DEPLOY_USER')
    port = required('DEPLOY_PORT')
    if not re.fullmatch(r'[A-Za-z0-9.-]+', host) or not re.fullmatch(r'[A-Za-z0-9_-]+', user) or not port.isdigit():
        raise ValueError('Invalid SSH host, user or port')
    root, public, legacy, php = [required(k) for k in ('DEPLOY_ROOT', 'PUBLIC_ROOT', 'LEGACY_APP', 'PHP_BIN')]
    for value in (root, public, legacy, php):
        if not re.fullmatch(r'/[A-Za-z0-9_./-]+', value) or '..' in value or value == '/':
            raise ValueError('Deployment paths must be absolute and contain no spaces or parent traversal')
    release = f"{required('GITHUB_SHA')}-{required('GITHUB_RUN_ID')}-{required('GITHUB_RUN_ATTEMPT')}"
    if not re.fullmatch(r'[0-9a-f]{40}-[0-9]+-[0-9]+', release):
        raise ValueError('Invalid release identifier')
    ssh = ['ssh', '-p', port, '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'ConnectTimeout=20', '-i', str(Path.home()/'.ssh/luxurry_deploy')]
    remote = f'{user}@{host}'
    incoming = f'{root}/incoming/{release}'
    subprocess.run(ssh+[remote, shlex.join(['mkdir', '-p', incoming])], check=True)
    subprocess.run(['rsync', '-az', '-e', shlex.join(ssh), 'staging-release/luxurry-staging.tar.gz', 'staging-release/SHA256SUMS', 'platform/deploy/activate-release.sh', 'platform/deploy/front-controller.php', f'{remote}:{incoming}/'], check=True)
    args=['bash', f'{incoming}/activate-release.sh', root, public, legacy, php, required('DEPLOY_URL'), release]
    subprocess.run(ssh+[remote, shlex.join(args)], check=True)

if __name__ == '__main__':
    main()
