# Deployment review

These changes are prepared for staging. Do not merge until the deployed commit,
Node version, API URL and current cPanel settings have been checked.

## Verification

- Build with `npm ci` and `npm run build` outside the production document root.
- Test the storefront, dashboard login/logout, search, category/brand filters,
  pagination and product/image create, update and delete against a staging database.
- Preserve existing environment variables, uploaded files and cPanel-managed rules.
- Back up the current build and database before deployment; retain the previous
  build for rollback. These changes require no database migration.
- Record cold and warm homepage and catalog loads on mobile, API timings and
  cPanel CPU/memory usage before and after. No production speed percentage is
  claimed from a local build.

## cPanel

The storefront uploads `build/`; the dashboard uploads `dist/`. The API needs
cPanel Node.js/Passenger support with the compiled `dist/server.js` entry point
and production dependencies. Restart through cPanel after deploying the API.
Do not place the source tree or `.env` in a publicly served directory.

The storefront includes `public/.htaccess` for direct navigation to React routes,
optional text compression, and HTML revalidation. Merge it with existing hosting
rules rather than replacing cPanel rules. Keep `/api` outside the SPA fallback.
Confirm `/home` and `/shop` work when opened directly and refreshed.

The server deployment workflow now targets `main` only. Its existing FTP deployment
still needs review for upload scope and secret destinations before merging.
