#!/usr/bin/env python3
"""No external connection: FTPS protocol fixture and cPanel cron integration."""
import ftplib
import hashlib
import importlib.util
import io
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import tempfile
import unittest

APP=Path(__file__).resolve().parents[2]
def module(path,name):
    spec=importlib.util.spec_from_file_location(name,path)
    value=importlib.util.module_from_spec(spec);spec.loader.exec_module(value);return value
driver=module(APP/'tools/deploy-ftps.py','ftps_driver')
fixture=module(APP/'tests/browser/deploy.test.py','activation_fixture')

class FakeFTP:
    def __init__(self):
        self.files={'AGENT_READY':b'luxurry-ftps-agent-v1\n'}
        self.operations=[];self.fail_upload=False
    def mkd(self,path):self.operations.append(('mkdir',path))
    def retrbinary(self,command,callback):
        name=command.removeprefix('RETR ')
        if name not in self.files:raise ftplib.error_perm('550 Not found')
        callback(self.files[name])
    def storbinary(self,command,stream):
        if self.fail_upload:raise ConnectionError('interrupted')
        name=command.removeprefix('STOR ');self.files[name]=stream.read();self.operations.append(('upload',name))
    def rename(self,source,target):
        self.files[target]=self.files.pop(source);self.operations.append(('rename',target))
    def close(self):pass

class TransferTest(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name)
        self.files={}
        for name in driver.FILES:
            p=self.root/name;p.write_bytes(name.encode());self.files[name]=str(p)
        self.release='a'*40+'-123-1';self.ftp=FakeFTP()
    def tearDown(self):self.temp.cleanup()
    def test_marker_is_last_and_every_payload_is_checksummed(self):
        driver.upload(self.ftp,self.release,self.files)
        self.assertEqual(self.ftp.operations[-1],('rename',self.release+'/READY'))
        self.assertEqual(self.ftp.files[self.release+'/READY'].decode().strip(),self.release)
        manifest=self.ftp.files[self.release+'/DEPLOY.SHA256'].decode()
        for name,p in self.files.items():self.assertIn(hashlib.sha256(Path(p).read_bytes()).hexdigest()+'  '+name,manifest)
    def test_interrupted_upload_never_publishes_ready_marker(self):
        self.ftp.fail_upload=True
        with self.assertRaises(ConnectionError):driver.upload(self.ftp,self.release,self.files)
        self.assertNotIn(self.release+'/READY',self.ftp.files)
    def test_agent_readiness_required(self):
        self.ftp.files['AGENT_READY']=b'unknown'
        with self.assertRaises(ValueError):driver.upload(self.ftp,self.release,self.files)
        self.assertFalse(self.ftp.operations)
    def test_failure_acknowledgement_fails_workflow(self):
        self.ftp.files[self.release+'/STATUS']=b'failed\n'
        with self.assertRaises(RuntimeError):driver.wait_for_activation(self.release,connect=lambda:self.ftp)
    def test_upload_is_not_success_until_cron_acknowledges(self):
        state=[0]
        def pause(_):
            state[0]+=1;self.ftp.files[self.release+'/STATUS']=b'succeeded\n'
        driver.wait_for_activation(self.release,connect=lambda:self.ftp,clock=lambda:state[0],pause=pause,timeout=10,interval=1)
        self.assertEqual(state[0],1)
    def test_missing_acknowledgement_times_out(self):
        tick=[0]
        def pause(_):tick[0]+=1
        with self.assertRaises(TimeoutError):driver.wait_for_activation(self.release,connect=lambda:self.ftp,clock=lambda:tick[0],pause=pause,timeout=2,interval=1)

class CronTest(fixture.DeploymentTest):
    # Reuse the temporary application, fake PHP and fake HTTP health checker.
    def setUp(self):
        super().setUp()
        shutil.copy(APP/'deploy/activate-release.sh',self.incoming)
        manifest=''.join(hashlib.sha256((self.incoming/name).read_bytes()).hexdigest()+'  '+name+'\n' for name in driver.FILES)
        (self.incoming/'DEPLOY.SHA256').write_text(manifest)
        (self.incoming/'READY').write_text(self.release+'\n')
        self.config=self.base/'config.sh'
        self.config.write_text('\n'.join(k+'='+shlex.quote(str(v)) for k,v in {'DEPLOY_ROOT':self.root,'PUBLIC_ROOT':self.public,'LEGACY_APP':self.legacy,'PHP_BIN':self.php,'BASE_URL':'https://example.test'}.items())+'\n')
    def run_agent(self,*args):
        return subprocess.run(['bash',str(APP/'deploy/ftp-agent.sh'),str(self.config),*args],env=self.env,capture_output=True,text=True)
    def test_ready_marker_activates_once(self):
        result=self.run_agent();self.assertEqual(result.returncode,0,result.stderr)
        self.assertEqual((self.incoming/'STATUS').read_text().strip(),'succeeded')
        self.assertTrue((self.incoming/'CLAIMED').exists());self.preserved()
        self.assertEqual(self.run_agent().returncode,0)
        self.assertEqual((self.incoming/'STATUS').read_text().strip(),'succeeded')
    def test_partial_upload_is_ignored(self):
        (self.incoming/'READY').rename(self.incoming/'READY.part')
        self.assertEqual(self.run_agent().returncode,0)
        self.assertFalse((self.root/'current').exists());self.preserved()
    def test_checksum_failure_never_executes_uploaded_script(self):
        (self.incoming/'activate-release.sh').write_text('touch '+str(self.base/'bad'))
        self.assertNotEqual(self.run_agent().returncode,0)
        self.assertFalse((self.base/'bad').exists())
        self.assertEqual((self.incoming/'STATUS').read_text().strip(),'failed');self.preserved()
    def test_stale_submission_cannot_replace_newer_deployment(self):
        (self.root/'last-attempt').write_text('124 1\n')
        self.assertEqual(self.run_agent().returncode,0)
        self.assertEqual((self.incoming/'STATUS').read_text().strip(),'superseded')
        self.assertFalse((self.root/'current').exists());self.preserved()
    def test_failed_health_is_acknowledged_and_old_site_restored(self):
        self.env['FAIL_HEALTH']='1'
        self.assertNotEqual(self.run_agent().returncode,0)
        self.assertEqual((self.incoming/'STATUS').read_text().strip(),'failed')
        self.assertEqual((self.public/'index.php').read_text(),'original controller');self.preserved()
    def test_preflight_creates_readiness_without_activating(self):
        self.assertEqual(self.run_agent('--check').returncode,0)
        self.assertEqual((self.root/'incoming/AGENT_READY').read_text().strip(),'luxurry-ftps-agent-v1')
        self.assertFalse((self.root/'current').exists())

if __name__=='__main__':unittest.main()
