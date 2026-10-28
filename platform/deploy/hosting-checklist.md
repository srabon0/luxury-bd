# Host confirmation needed before staging

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
