import importlib.util
from pathlib import Path
import tarfile
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('release', Path(__file__).resolve().parents[2] / 'tools/build-release.py')
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)

class ReleasePackageTest(unittest.TestCase):
    def fixture(self, root):
        for name in release.FILES:
            (root / name).write_text('fixture')
        for name in ['vendor/autoload.php', 'app/Test.php', 'public/.htaccess', 'bootstrap/cache/config.php', '.env', 'storage/app/public/private-upload.jpg', 'database/database.sqlite', 'database/customer-export.sql', 'public/customer-backup.json', 'config/.env.production', 'tests/Secret.php', 'tools/render-review.php', 'deploy/STAGING.md', 'deploy/BACKUPS.md']:
            file = root / name
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text('PRIVATE' if name in ['.env','bootstrap/cache/config.php'] else 'fixture')
        (root / 'public/linked-secret').symlink_to(root / '.env')

    def test_package_excludes_environment_caches_uploads_databases_tests_and_symlinks(self):
        with tempfile.TemporaryDirectory() as folder:
            source, output = Path(folder)/'source', Path(folder)/'out'
            source.mkdir(); self.fixture(source)
            archive = release.build(source, output, 'test-sha')
            with tarfile.open(archive) as tar:
                names = tar.getnames()
                for suffix in ['.env','bootstrap/cache/config.php','storage/app/public/private-upload.jpg','database/database.sqlite','database/customer-export.sql','public/customer-backup.json','config/.env.production','tests/Secret.php','public/linked-secret','tools/render-review.php']:
                    self.assertNotIn('luxurry-platform/'+suffix,names)
                for suffix in ['vendor/autoload.php','.env.example','public/.htaccess','STAGING.md','build-manifest.json','storage/app/public']:
                    self.assertIn('luxurry-platform/'+suffix,names)
                self.assertFalse(any(entry.issym() for entry in tar.getmembers()))
            self.assertIn(archive.name,(output/'SHA256SUMS').read_text())

    def test_development_vendor_and_nested_output_are_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)/'source'; root.mkdir(); self.fixture(root)
            with self.assertRaises(ValueError): release.build(root,root/'out','test')
            (root/'vendor/phpunit/phpunit').mkdir(parents=True)
            with self.assertRaises(ValueError): release.build(root,Path(folder)/'out','test')

if __name__ == '__main__':
    unittest.main()
