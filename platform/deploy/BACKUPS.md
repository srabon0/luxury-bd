# Scheduled local backups and restore acceptance

The application can create a compressed database/upload backup using the hosting
account's MySQL/MariaDB client and tar. No paid storage service or persistent worker
is required. Hosting support for proc_open, mysqldump/mariadb-dump, tar, file locks,
cron and disk space must be verified before enabling the schedule.

1. Set BACKUP_DIRECTORY to an absolute private path outside every public document
   root and outside the upload disk. Use a durable shared location across releases.
   Keep the whole application storage directory durable/shared across releases so
   backup/catalog locks coordinate across releases. Set MYSQLDUMP_BINARY and
   TAR_BINARY if the binaries are not in the cron user's PATH.
2. Run `php artisan luxurry:backup` manually using the domain's PHP CLI version.
   The command reports only the completed filename; failures return nonzero and
   are reported to the private application log. Monitor that log and disk quota.
3. Verify the .sha256 file. In a SEPARATE disposable staging database, import the
   archive's database.sql and verify products, private prices, users and audit data.
   The manifest's uploads_directory identifies the upload folder inside the archive;
   restore its contents to the public disk root. Check several real image URLs.
   Never test restoration against production. Keep restored images/accounts private.
4. After this succeeds, set BACKUPS_ENABLED=true and BACKUP_KEEP_DAYS as required.
   Configure cPanel cron to run the following every minute, replacing placeholders
   with the correct absolute paths:

   `<php-cli> <application>/artisan schedule:run`

   The backup runs daily at 02:00 UTC. Expired reset tokens are cleaned daily too.
   Run `php artisan schedule:list` to inspect schedules. Verify completion of the
   first scheduled backup; this source package does not create cron jobs itself.

The SQL dump is streamed to disk rather than buffered in application memory.
Credentials go in a temporary private option file, never command-line arguments;
the temporary workspace is removed on completion/failure. Archives and checksums
are owner-readable/writable only. Retention removes only matching older application
backup files after a new archive has been validated. Unrelated files are retained.
If a process is killed by the host, inspect and remove abandoned .work-* / .partial-*
files privately after confirming no backup process is running; do not delete them
blindly from a scheduled task.

Database and uploads are protected from this application's concurrent workspace
writes using a file lock. Staff can still read; updates receive a retryable 503
while the snapshot is running. Changes made directly through SQL, FTP or other
applications are not covered by that lock and must be paused during a backup.
Do not assume consistency if another application writes to these tables/uploads.

Local backups contain confidential user password hashes, internal prices and other
database data. Compression does not encrypt them. Do not expose or publish archives.
Keep APP_KEY/environment secrets separately secured: they are deliberately absent
from these archives and must be preserved for a restore. Keep an encrypted copy
outside this hosting account for recovery from account loss or a server failure.
Local-only retention does not protect against loss of the hosting account itself.

Plan enough free disk space for the SQL snapshot plus the new archive and retained
archives. Automatic pruning does not run until a new backup has passed validation.
Set retention conservatively and monitor actual archive growth on staging.
