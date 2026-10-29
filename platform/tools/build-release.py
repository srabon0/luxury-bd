#!/usr/bin/env python3
"""Build a source-and-vendor staging archive; never package runtime data or secrets."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import tarfile
import tempfile

DIRECTORIES = ('app', 'bootstrap', 'config', 'database', 'public', 'resources', 'routes', 'vendor')
FILES = ('artisan', 'composer.json', 'composer.lock', '.env.example')
DEV_PACKAGES = ('phpunit/phpunit', 'fakerphp/faker', 'mockery/mockery', 'laravel/pint', 'nunomaduro/collision', 'laravel/pail', 'laravel/pao')
STORAGE_DIRECTORIES = ('app/private', 'app/public', 'framework/cache/data', 'framework/sessions', 'framework/views', 'logs')


def include(relative):
    parts = relative.parts
    if any(part in ('.git', 'node_modules', '__pycache__') or part.startswith('.env') for part in parts):
        return False
    if parts[0] == 'database' and (len(parts) < 2 or parts[1] not in ('migrations','seeders','factories')):
        return False
    if parts[0] == 'public' and (len(parts) < 2 or parts[1] not in ('assets','index.php','.htaccess','robots.txt','favicon.ico')):
        return False
    if parts[:2] in (('bootstrap', 'cache'), ('public', 'storage')):
        return False
    if relative.suffix in ('.sqlite', '.db', '.log'):
        return False
    return True


def build(source, output, commit):
    source, output = source.resolve(), output.resolve()
    if output == source or source in output.parents:
        raise ValueError('Release output must be outside the application directory.')
    if not (source / 'vendor/autoload.php').is_file():
        raise ValueError('Install locked production dependencies before packaging.')
    for package in DEV_PACKAGES:
        if (source / 'vendor' / package).exists():
            raise ValueError(f'Development dependency present: {package}. Run composer install --no-dev first.')
    output.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='luxurry-release-') as temporary:
        root = Path(temporary) / 'luxurry-platform'
        root.mkdir()
        for directory in DIRECTORIES:
            for file in sorted((source / directory).rglob('*')):
                relative = file.relative_to(source)
                if file.is_symlink() or not file.is_file() or not include(relative):
                    continue
                target = root / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(file, target)
                target.chmod(0o644)
        for name in FILES:
            shutil.copyfile(source / name, root / name)
            (root / name).chmod(0o644)
        for directory in STORAGE_DIRECTORIES:
            (root / 'storage' / directory).mkdir(parents=True, exist_ok=True)
        (root / 'bootstrap/cache').mkdir(parents=True, exist_ok=True)
        (root / 'STAGING.md').write_text((source / 'deploy/STAGING.md').read_text())
        (root / 'BACKUPS.md').write_text((source / 'deploy/BACKUPS.md').read_text())
        manifest = {'application': 'Luxurry', 'source_commit': commit, 'purpose': 'staging acceptance testing', 'contains_database': False, 'contains_environment_file': False, 'includes_production_dependencies': True}
        (root / 'build-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
        archive = output / 'luxurry-staging.tar.gz'
        with tarfile.open(archive, 'w:gz') as tar:
            tar.add(root, arcname='luxurry-platform', recursive=True)
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    (output / 'SHA256SUMS').write_text(f'{digest}  {archive.name}\n')
    return archive


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    archive = build(args.source, args.output, os.environ.get('GITHUB_SHA', 'local-uncommitted-build'))
    print(f'Staging archive created: {archive.name} ({archive.stat().st_size} bytes)')
