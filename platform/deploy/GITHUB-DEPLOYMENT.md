# GitHub Actions production deployment

Push or merge application changes to `main` → PHP tests on MariaDB and SQLite,
JavaScript checks, dependency audit, production dependency build and extracted
package smoke test → SSH upload → migrations/configuration → release activation
→ live checks. Feature branches and pull requests never deploy.

## Status and first-time setup

The workflow is prepared, not connected to a hosting account automatically.
The existing Laravel PR must be merged before `main` contains the application.
The previous React FTP workflow is replaced so it cannot overwrite the Laravel site.

This deployment transport needs an SSH shell, `bash`, `rsync`, `flock`, `tar`,
`sha256sum`, `curl` and PHP 8.4 on the host. A cPanel **SSH Access** key screen
does not itself prove that shell access is enabled. Confirm shell/rsync access
with the hosting provider before enabling production deployment. An FTP-only
account cannot run this workflow; do not enter FTP credentials as SSH credentials.

1. Take a fresh database and full file backup, including public uploads.
2. Enable shell access and authorize a dedicated deployment public key for the
   hosting account. Keep its private key out of Git and chat.
3. Create the GitHub environment `production`. Configure repository variables
   and environment secrets below. Required environment reviewers are optional;
   omit reviewers if every successful main-branch push should deploy automatically.
4. Verify the server SSH host-key fingerprint through the provider or another
   trusted channel. Store its matching known_hosts lines, including `[host]:port`
   for a nondefault port. The workflow does not disable host-key checking.
5. Confirm `PUBLIC_ROOT/storage` is the **real directory** used for current
   uploads. The workflow deliberately refuses a public storage symlink.
6. Set `PRODUCTION_DEPLOY_ENABLED=true` only once the settings and backup are ready.
   Run **Laravel foundation checks → Run workflow → main** for the first deployment.
   This workflow must exist on the default branch for manual dispatch.
7. Check the production job, homepage, products, staff login, a draft image upload
   and contact email. Subsequent commits to `main` deploy after checks succeed.

### Secrets (production environment)

| Secret | Value |
| --- | --- |
| `DEPLOY_HOST` | Hosting SSH hostname |
| `DEPLOY_USER` | Hosting SSH account username |
| `DEPLOY_SSH_KEY` | Dedicated, unencrypted deployment private key |
| `DEPLOY_KNOWN_HOSTS` | Verified server SSH public host-key lines |

### Repository variables

| Variable | Value |
| --- | --- |
| `PRODUCTION_DEPLOY_ENABLED` | `true` to enable; absent or any other value disables deployment |
| `DEPLOY_PORT` | SSH port, defaults to `22` |
| `DEPLOY_ROOT` | New private deployment directory, outside the web root |
| `PUBLIC_ROOT` | Existing real domain document root |
| `LEGACY_APP` | Existing working production Laravel application directory |
| `PHP_BIN` | Absolute path to the host's working PHP 8.4 CLI executable |
| `DEPLOY_URL` | Canonical production HTTPS URL, without a trailing slash |

Paths must be absolute, without spaces or `..`. Keep infrastructure values in
GitHub settings, not tracked files. Never paste live environment-file contents,
database credentials or mail passwords into a workflow.

## Files and data

Each build is installed to `DEPLOY_ROOT/releases/<commit>-<run>-<attempt>`.
The original production application remains intact. Releases share its `.env`
and runtime `storage` through **private PHP-side links**; Apache does not serve
these links. Do not delete `LEGACY_APP`, its `.env` or storage after activation.

Existing images and all future uploads stay in `PUBLIC_ROOT/storage`. Configuration
reads `PUBLIC_STORAGE_ROOT`; the deploy command sets and caches it explicitly.
Assets are real files under `PUBLIC_ROOT/_releases/<release>/assets`, with a
release-specific cached `ASSET_URL`. Apache does not need to follow a symlink.
The workflow does not edit `.htaccess`, robots.txt, TLS challenge directories,
uploaded images or database records, except for forward schema migrations.

The first deployment backs up the public index privately, then installs a small
front controller. A private `current` file selects the release; later switches
replace that file atomically. The first index replacement and pointer switch are
two operations, so first-time setup is not a fully atomic cutover.

No application environment file is uploaded from GitHub. `APP_KEY`, mail settings,
database settings, users, prices and products remain host-owned. Do not run
`storage:link` for this deployment layout. cPanel full-account backups must include
both the application and document root; do not rely on a legacy upload-only backup
that still reads `storage/app/public`.

## Failure and rollback

Jobs are serialized and the server takes a deployment lock. An activation failure
before the pointer changes leaves the previous code selected. Live checks require
successful `/` and `/products` responses **from the new release**, identified by
`X-Luxurry-Release`, so a cached previous homepage is not accepted as success.
Failed live checks restore the previous code pointer (or first-deploy index).

**Database migrations are not rolled back automatically.** Use backward-compatible
schema changes and make a fresh database backup before a schema change. Do not
assume code rollback reverses a destructive migration. Public release assets and
private release directories are retained; periodically prune only releases that
are neither current nor previous after checking backups and disk space.

For a manual rollback, select an existing tested release by replacing the private
`current` file with its release ID using a temporary file and rename. The
`previous` file records the previous successful release. Then repeat live checks.
Retain its public asset directory. Do not restore a database unless recovery
requires it and the operator understands which newer records would be lost.

Existing cron commands that hardcode `LEGACY_APP/artisan` continue running old
code. Before enabling scheduled jobs, update their launcher to read `current`
and run that release's artisan command; preserve the same shared runtime data.

## Verification

CI runs shell syntax, PHP front-controller syntax and deployment integration
tests. The integration fixture checks successful activation, rollback after a
failed health check, rejected public symlinks, and preservation of runtime files,
environment content and public uploads. Local fixture tests use a mocked PHP
binary; real PHP syntax and application tests run in GitHub Actions. Host SSH,
permissions, extensions and live delivery still require the first real deployment.
