# Luxurry Laravel platform — foundation

A single Laravel 13 application for the public catalog and staff workspace. Target:
PHP 8.3+, MySQL/MariaDB and local images within the existing cPanel account.
No paid image platform, separate frontend hosting, Node server or Redis is required.
The approved private design demo remains separate and unchanged.

## Implemented in this milestone

- Public server-rendered catalog, details and allowlisted JSON endpoints with no prices.
- Internal prices in a separate table, accessed only by active authenticated staff.
- Admin staff/role management; Catalog Manager product/category/image/price editing;
  SR read-only catalog and internal prices. No public sign-up or default staff password.
- Session sign-in/out, CSRF protections, rate limits, validation, no-store staff responses.
- Local WebP images and thumbnails, generated from validated JPG/PNG/WebP inputs.
- Contact email using configured SMTP, fixed recipient and verified sender; user as Reply-To.
- Architectural public layouts across home, catalog, details, comparison and contact; staff catalog overview/status badges and current-image preview.
- Product/comparison enquiries prefill published product names/codes without prices.
- Original Classic Group emblem and optimized local homepage video, deferred until after paint.
- Published-product comparison (up to three), shareable URLs, persistent local selection and responsive specification table. No internal prices or draft details.

## Not a production release yet

Host screenshots confirm MariaDB 10.6.28, PHP 8.4 availability, 1 GB account RAM and 20 entry processes.
The live domains were set to PHP 8.0; staging must explicitly use PHP 8.4.
Per-domain PHP extensions, document-root control, storage symlink support, mail limits and cron support still need verification. Laravel 13
requires PHP 8.3 or newer. Do not change the live site or run migrations against its database.

PHP/Composer installation in the coding workspace could not complete. CI must install
and execute the PHP tests. A production build artifact must be reviewed before a release. Existing MongoDB/catalog data is not migrated.

Professional resources, full content/settings administration,
account password recovery, audit trail, backup automation and final visual parity
with the approved demo remain later milestones. The public catalog intentionally
has no pricing, cart, checkout or orders. Admin currently controls all implemented
workspace features; future website-content permissions are not represented as done.

## Local setup (PHP 8.3+)

1. `composer install` (uses the committed lock file).
2. Copy `.env.example` to `.env`; set a dedicated development MySQL/MariaDB database.
3. `php artisan key:generate` then `php artisan migrate`.
4. `php artisan storage:link` and `php artisan luxurry:create-admin`.
5. For local HTTP only, set `SESSION_SECURE_COOKIE=false`; use true with HTTPS.
6. `php artisan serve`. Public routes: `/`, `/products`, `/contact`.
7. Staff sign-in: `/staff/login`; workspace: `/workspace`.
8. `php artisan test`. Tests use an isolated in-memory SQLite database by default.
9. `node --test tests/browser/*.test.mjs` for comparison and deferred-video behavior (Node is a development/CI dependency only).

Production contact email must set `CONTACT_TO_ADDRESS`, `MAIL_MAILER=smtp`, mailbox
credentials and `MAIL_FROM_ADDRESS` authorized by the host. Keep `.env` out of Git.
Development log/array mail drivers do not deliver email. SMTP submission does not
prove delivery; test the destination mailbox and configure SPF/DKIM with the host.

## cPanel deployment design (pending host confirmation)

Keep the application outside `public_html`; point the domain document root to the
application's `public/` directory. Never expose the application root, `.env`, vendor
or database backups. If the host cannot support this, stop and agree on a secure
alternative. Do not move index.php to the project root.

Prepare Composer dependencies/optimized autoload and assets in CI, upload a versioned
release, configure environment and writable `storage/` plus `bootstrap/cache/`, link
public storage, migrate a staging database, then run `php artisan optimize`. No daemon
is required for this milestone. Contact submission is synchronous and rate-limited;
if queued mail is added, use a short scheduled worker with cPanel cron, not an assumed
always-on background process. Back up the database AND uploads before deployment;
retain the prior release and explicitly review rollback compatibility for migrations.

Price responses, authenticated pages and login responses must never be included in
public HTTP/CDN caches. Disk and inode quotas still apply to locally stored images.
Large traffic capacity cannot be promised on shared hosting without measurements.
