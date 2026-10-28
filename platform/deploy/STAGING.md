# Luxurry staging installation

This archive is for staging acceptance testing. It is not authorization to replace
production. It includes locked production PHP dependencies and local assets; no
Composer or Node process needs to run continuously on the host. It contains no
application database, real accounts, uploads or .env.

1. Verify `SHA256SUMS`, then extract to a new versioned folder outside the public
   web root. Do not extract over the old application or its uploads. Check the
   source commit in `build-manifest.json` against the reviewed draft.
2. Create a staging domain with HTTPS and select PHP 8.4 for that domain. Set its
   document root to this release's `public/` folder. Do not expose the project root.
   The PHP CLI used for the commands below must match the domain's PHP version.
3. Create a dedicated staging database and user. Use utf8mb4. Copy `.env.example`
   to `.env` locally on the host, set `APP_ENV=staging`, `APP_DEBUG=false`, the staging
   HTTPS `APP_URL`, database credentials, file cache/sessions, secure session cookie,
   configured SMTP and contact destination. Keep credentials on the host.
4. Make `storage/` and `bootstrap/cache/` writable by the hosting account; keep them
   outside public access. Do not set permissions to 777. Ensure GD can encode WebP
   and PDO MySQL is enabled. Verify required PHP extensions before proceeding.
5. In the application folder, run:

   ```sh
   php artisan key:generate
   php artisan migrate --force
   php artisan storage:link
   php artisan luxurry:create-admin
   php artisan optimize
   ```

   Generate a key once for this new staging installation. Preserve an installation's
   existing key across later releases. The administrator command prompts for a
   password; no default credentials exist. If CLI or storage links are unavailable,
   stop and resolve this with the host rather than exposing an installer or .env.
6. Test the public collection, search, categories, details, comparison (including
   stale/removed products), video controls, mobile layouts and contact delivery.
   Upload a real sample image and check the generated WebP and thumbnail URLs.
7. Create separate Admin, Catalog Manager and SR test accounts. Verify that SR
   cannot change catalog data or view the activity log, managers cannot manage
   accounts or view the log, and Admin sees activity for catalog/staff changes.
   Confirm that public HTML/JSON never includes internal prices or draft details.
8. Test actual SMTP delivery to the destination mailbox and the visitor Reply-To.
   Measure page loading and concurrent requests within hosting limits. Review
   disk/inode use, logs, backup completeness and restore procedures.

## Before a production switch

Complete the outstanding product/content/security work in the draft README first.
Take and verify database AND upload backups outside the public web root. Retain the
previous application release. Use a separate production database and environment;
never copy staging accounts or fixtures into production. The archive does not
contain a populated catalog. Keep shared uploads and file sessions/cache durable
across releases rather than replacing them with the empty archive directories.

Do not regenerate the production application key. Review pending migrations and
rollback compatibility. The audit migration adds a table; rolling back its schema
would destroy its history, so prefer switching back to a compatible prior release
and retain the table. Do not run migrate:fresh, drop databases or remove unrelated
hosting email/DNS/account files. Switch the domain only after staging acceptance.

## Activity-log scope

Catalog and staff mutations made through this application, including first-admin
creation, are recorded in the same database transaction as the business change.
The log stores actor names/roles, event, record label and changed field names, not
submitted values, passwords, internal prices or request bodies. Deleted records
remain identifiable by type/id/label. There is no application endpoint to edit or
delete log entries. Database administrators can still alter database records;
this is not a cryptographically tamper-proof or external compliance archive.
Plan retention and backups appropriate to disk space and business requirements.
