# cPanel staging checklist

## Confirmed from owner screenshots (28 October 2026)

- MariaDB 10.6.28 on localhost. Create a dedicated application database with utf8mb4; do not inherit the server latin1 default.
- PHP 8.4 is available. Both existing domains explicitly use PHP 8.0, so staging must select PHP 8.4 per domain. phpMyAdmin’s PHP version does not establish website runtime.
- Account limits shown: 1 GB physical memory, 20 entry processes, CPU quota 100%, 4.88 GB disk with about 3.42 GB free. These do not establish visitor capacity or PHP memory_limit.
- SSH Access and JetBackup icons are present; actual SSH access and restore availability remain unverified.
- Owner permits replacement of old application data at deployment. First take and verify backups, test the new release on staging and scope removal to the old application files/data. Preserve hosting email, DNS and unrelated account files.

## Still to verify

Collect screenshots or non-secret configuration values; never post passwords or .env.

- PHP 8.3+ with Ctype, cURL, DOM, Fileinfo, Filter, Hash, Mbstring, OpenSSL, PCRE,
  PDO MySQL, Session, Tokenizer, XML and GD with WebP encoding; OPcache availability.
- MySQL/MariaDB version, database/user quota, disk/inode quota, memory/CPU/I/O limits.
- Domain document root can target the Laravel public/ directory.
- storage/public symlink or another approved way to expose only generated product images.
- SSH/Terminal/Composer availability; otherwise upload dependencies built in CI.
- Cron minimum interval, mail submission credentials/limits, HTTPS, SPF/DKIM.
- Staging subdomain, database/upload backups and restore/rollback process.

Do not assume that cPanel ownership grants control of the server or webserver modules.
