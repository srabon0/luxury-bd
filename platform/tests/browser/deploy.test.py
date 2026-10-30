#!/usr/bin/env python3
"""Exercise activation against temporary files, never a hosting account."""
import hashlib
import os
from pathlib import Path
import shutil
import subprocess
import tarfile
import tempfile
import unittest

APP = Path(__file__).resolve().parents[2]

class DeploymentTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.base = Path(self.temp.name)
        self.root = self.base/'private'
        self.public = self.base/'public'
        self.legacy = self.base/'legacy'
        self.bin = self.base/'bin'
        for p in (self.root,self.public,self.legacy,self.bin):p.mkdir()
        (self.public/'storage/products').mkdir(parents=True)
        (self.public/'storage/products/photo.webp').write_bytes(b'upload')
        (self.public/'.htaccess').write_text('existing server rules')
        (self.public/'index.php').write_text('original controller')
        (self.legacy/'storage/framework/sessions').mkdir(parents=True)
        (self.legacy/'storage/framework/sessions/session').write_text('session data')
        (self.legacy/'.env').write_text('APP_KEY=unchanged\n')
        self.release='a'*40+'-123-1'
        self.incoming=self.root/'incoming'/self.release
        self.incoming.mkdir(parents=True)
        fixture=self.base/'fixture/luxurry-platform'
        for d in ('vendor','public/assets','storage','bootstrap/cache'):(fixture/d).mkdir(parents=True)
        (fixture/'vendor/autoload.php').write_text('<?php')
        (fixture/'artisan').write_text('<?php')
        (fixture/'public/assets/app.css').write_text('new css')
        archive=self.incoming/'luxurry-staging.tar.gz'
        with tarfile.open(archive,'w:gz') as tar:tar.add(fixture,arcname='luxurry-platform')
        digest=hashlib.sha256(archive.read_bytes()).hexdigest()
        (self.incoming/'SHA256SUMS').write_text(f'{digest}  luxurry-staging.tar.gz\n')
        shutil.copy(APP/'deploy/front-controller.php',self.incoming)
        self.php=self.bin/'php'
        self.php.write_text('''#!/usr/bin/env python3
import sys
from pathlib import Path
if len(sys.argv)>3 and sys.argv[1]=='-r' and 'file_put_contents' in sys.argv[2]:
 Path(sys.argv[4]).write_text(Path(sys.argv[3]).read_text().replace('DEPLOY_ROOT_LITERAL',repr(sys.argv[5])))
''')
        self.php.chmod(0o755)
        curl=self.bin/'curl'
        curl.write_text('''#!/usr/bin/env python3
import os,sys
from pathlib import Path
if os.environ.get('FAIL_HEALTH')=='1':sys.exit(22)
Path(sys.argv[sys.argv.index('-D')+1]).write_text('HTTP/2 200\\nX-Luxurry-Release: '+os.environ['TEST_RELEASE']+'\\n')
''')
        curl.chmod(0o755)
        self.env={**os.environ,'PATH':str(self.bin)+os.pathsep+os.environ['PATH'],'TEST_RELEASE':self.release}
    def tearDown(self):self.temp.cleanup()
    def run_deploy(self):
        return subprocess.run(['bash',str(APP/'deploy/activate-release.sh'),str(self.root),str(self.public),str(self.legacy),str(self.php),'https://example.test',self.release],env=self.env,capture_output=True,text=True)
    def preserved(self):
        self.assertEqual((self.public/'storage/products/photo.webp').read_bytes(),b'upload')
        self.assertEqual((self.public/'.htaccess').read_text(),'existing server rules')
        self.assertEqual((self.legacy/'.env').read_text(),'APP_KEY=unchanged\n')
        self.assertEqual((self.legacy/'storage/framework/sessions/session').read_text(),'session data')
    def test_activation_preserves_runtime_and_versions_assets(self):
        r=self.run_deploy();self.assertEqual(r.returncode,0,r.stderr)
        self.assertEqual((self.root/'current').read_text().strip(),self.release)
        self.assertTrue((self.root/'releases'/self.release/'.env').is_symlink())
        self.assertEqual((self.public/'_releases'/self.release/'assets/app.css').read_text(),'new css')
        self.assertIn(str(self.root),(self.public/'index.php').read_text())
        self.preserved()
    def test_first_deploy_health_failure_restores_original_index(self):
        self.env['FAIL_HEALTH']='1'
        r=self.run_deploy();self.assertNotEqual(r.returncode,0)
        self.assertEqual((self.public/'index.php').read_text(),'original controller')
        self.assertFalse((self.root/'current').exists());self.preserved()
    def test_later_failure_restores_previous_pointer(self):
        old='b'*40+'-122-1';(self.root/'current').write_text(old+'\n')
        self.env['FAIL_HEALTH']='1'
        r=self.run_deploy();self.assertNotEqual(r.returncode,0)
        self.assertEqual((self.root/'current').read_text().strip(),old);self.preserved()
    def test_public_storage_symlink_is_rejected(self):
        shutil.rmtree(self.public/'storage')
        (self.public/'storage').symlink_to(self.legacy/'storage',target_is_directory=True)
        self.assertNotEqual(self.run_deploy().returncode,0)
        self.assertEqual((self.public/'index.php').read_text(),'original controller')

if __name__=='__main__':unittest.main()
