# Automatic Laravel deployment: FTPS + cPanel cron

Push to `main` → tests → production build → encrypted FTPS upload → cron activates
the release → live checks → result returned to GitHub. SSH login is not required.
Pull requests and feature branches run tests without deploying. The old React FTP
workflow is retired by this PR. The optional SSH uploader is no longer selected.

## One-time host setup

1. Take a fresh database and file backup, including public uploads.
2. Make a private directory outside the domain document root. Install
   `ftp-agent.sh` and a copy of `ftp-config.example.sh` named `config.sh` there.
   Set the configuration file's permissions to `0600`.
3. Edit its five settings: `DEPLOY_ROOT` (this private directory), `PUBLIC_ROOT`
   (the real document root), `LEGACY_APP` (existing working production core),
   `PHP_BIN` (working PHP 8.4 CLI), and `BASE_URL` (canonical HTTPS URL).
   Paths must be absolute, without spaces or `..`. No FTP password goes here.
4. Run this once through a temporary cPanel cron, using your actual private paths:

   ```sh
   /bin/bash /PRIVATE/ftp-agent.sh /PRIVATE/config.sh --check > /PRIVATE/readiness.txt 2>&1
   ```

   Read `readiness.txt`. It must report `READY`. This checks PHP 8.4, bash, flock,
   rsync, curl, tar, sha256sum, realpath, the core environment, and a writable real
   public upload directory. It creates `incoming/AGENT_READY` for GitHub's check.
5. Replace that temporary cron with this permanent once-per-minute cron:

   ```sh
   /bin/bash /PRIVATE/ftp-agent.sh /PRIVATE/config.sh >> /PRIVATE/agent.log 2>&1
   ```

   Keep this deployment worker enabled. It exits quickly if nothing is waiting;
   a lock prevents overlapping activations. Remove older temporary diagnostic crons.
6. Create a dedicated cPanel FTP account rooted **exactly at
   `DEPLOY_ROOT/incoming`**. Correct any username suffix cPanel appends to its
   Directory field. Do not root it at public_html, the account home, or the whole
   deployment directory. It needs read/write/rename access within incoming only.
7. Confirm **explicit FTP over TLS**, normally port 21, works using the provider's
   certificate-matching FTP hostname. Plain FTP and disabled certificate validation
   are not supported. This deployment credential permits submitting executable
   release code; do not share it with people who should not deploy.

## One-time GitHub setup

The Laravel PR must be merged so `main` contains the application and new workflow.
Create a `production` environment and add these environment **Secrets**:

| Secret | Value |
| --- | --- |
| `FTP_SERVER` | Certificate-matching hostname, without protocol or port suffix |
| `FTP_USERNAME` | Full dedicated incoming-only FTP username |
| `FTP_PASSWORD` | That account's password |

These names match the previous FTP workflow, but verify the values and root
directory. An old FTP account is not automatically suitable for the new layout.

Add these repository **Variables**:

| Variable | Value |
| --- | --- |
| `PRODUCTION_DEPLOY_ENABLED` | `true` to enable; absent/other values skip deployment |
| `FTP_PORT` | Explicit FTPS control port; default `21` |
| `DEPLOY_URL` | Canonical public HTTPS URL for the GitHub environment link |

Enable deployment only after the host preflight, permanent cron, FTPS account and
backup are ready. Required environment reviewers are optional; omit them for fully
automatic main-branch deployment. Use branch protection to require checks before merging.

For the first deployment use **Laravel foundation checks → Run workflow → main**.
Subsequent successful pushes to main deploy automatically. GitHub waits up to
15 minutes for cron acknowledgement. A successful FTP upload alone is not success.

## Preservation and activation

* CI packages code and locked production dependencies; it excludes the real `.env`,
  databases and uploads. All files arrive under a new incoming release directory.
* Files upload with `.part` names. A checksum manifest covers the archive, its
  checksum file, activation script and front controller. The `READY` marker is last.
* Cron ignores incomplete uploads, rejects bad checksums and stale run/attempt IDs,
  and records private logs. Its short incoming `STATUS` never contains credentials.
* Each build extracts to a new private releases directory. Its `.env` and runtime
  storage are private PHP-side links to the existing working core. Apache never
  serves those links. **Keep the original core and its environment/runtime storage.**
* Existing and new product images stay in the real `PUBLIC_ROOT/storage` folder.
  The deployment caches `PUBLIC_STORAGE_ROOT` explicitly. Do not run `storage:link`.
* Release assets are real files under `PUBLIC_ROOT/_releases/<release>/assets`.
  The cached `ASSET_URL` selects them. `.htaccess`, TLS challenge directories,
  robots.txt and uploaded images are not replaced.
* Migrations and caches run before the private `current` release pointer changes.
  First-time setup backs up and replaces the public index; this initial two-file
  cutover is not fully atomic. Later pointer replacements are atomic.
* Checks require successful `/` and `/products` responses with the new
  `X-Luxurry-Release` header before publishing `STATUS=succeeded`.

## Failure, rollback and operations

Detailed logs: `DEPLOY_ROOT/logs/<release>.log`. Worker/preflight errors appear in
the private cron log or readiness file. Incoming STATUS exposes only a short state.

A failed live check restores the previous code pointer (or original first-deploy
index). **Database migrations are not reversed.** Use backward-compatible schema
changes and take a fresh database backup before schema changes. Code rollback does
not recover data removed by a destructive migration.

After READY is submitted, cancelling/timing out a GitHub job does not guarantee
cron stops. Inspect STATUS and the private current pointer before retrying. A rerun
creates a new attempt directory; never overwrite an old incoming release. Older
source should be redeployed through a deliberate new controlled build/run.

The private `previous` file identifies the preceding successful release. Manual
rollback atomically replaces `current` with a retained release ID, then repeats
live checks. Keep that release's public asset directory and first-index backups.

Full backups must include the database, shared environment/runtime storage,
deployment state, and document root with images. A legacy upload backup reading
only `storage/app/public` misses new public uploads. Verify off-host restores.
Inspect disk usage and prune only releases/archives/assets that are neither
current nor previous after verifying backups. Never delete the legacy shared core.

Other crons hardcoded to the old core's artisan still run old code; update their
launcher to select the private current release before enabling application schedules.

## Verification

Local fixtures exercise FTPS transfer sequencing and cron activation with mocked
PHP/HTTP, covering partial uploads, checksums, readiness, stale jobs, acknowledgement,
rollback and data preservation. CI also runs real PHP syntax/application/database
tests, dependency audit and extracted archive smoke tests. Host TLS, credentials
and preflight still require real setup; deployment remains disabled by default.
