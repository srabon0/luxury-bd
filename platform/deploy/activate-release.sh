#!/usr/bin/env bash
# Called by the private cPanel cron worker (or optional SSH transport).
set -Eeuo pipefail
umask 077
DEPLOY_ROOT=$1 PUBLIC_ROOT=$2 LEGACY_APP=$3 PHP_BIN=$4 BASE_URL=$5 RELEASE_ID=$6
[[ "$RELEASE_ID" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]] || exit 2
[[ "$BASE_URL" == https://* ]] || exit 2
for path in "$DEPLOY_ROOT" "$PUBLIC_ROOT" "$LEGACY_APP" "$PHP_BIN"; do
  [[ "$path" =~ ^/[a-zA-Z0-9_./-]+$ && "$path" != / && "$path" != *..* ]] || exit 2
done
command -v flock >/dev/null
command -v rsync >/dev/null
command -v curl >/dev/null
[[ -x "$PHP_BIN" && -f "$LEGACY_APP/.env" && -d "$LEGACY_APP/storage" ]]
[[ -d "$PUBLIC_ROOT/storage" && ! -L "$PUBLIC_ROOT/storage" ]]
mkdir -p "$DEPLOY_ROOT/releases" "$DEPLOY_ROOT/backups"
DEPLOY_ROOT=$(realpath "$DEPLOY_ROOT")
PUBLIC_ROOT=$(realpath "$PUBLIC_ROOT")
[[ "$DEPLOY_ROOT/" != "$PUBLIC_ROOT/"* ]]
exec 9>"$DEPLOY_ROOT/deploy.lock"
flock -w 120 9
INCOMING="$DEPLOY_ROOT/incoming/$RELEASE_ID"
RELEASE="$DEPLOY_ROOT/releases/$RELEASE_ID"
[[ ! -e "$RELEASE" ]]
cd "$INCOMING"
sha256sum --check SHA256SUMS
mkdir "$RELEASE"
tar -xzf luxurry-staging.tar.gz --strip-components=1 -C "$RELEASE"
[[ -f "$RELEASE/vendor/autoload.php" && -f "$RELEASE/artisan" ]]
[[ ! -e "$RELEASE/.env" && ! -L "$RELEASE/storage" ]]
# The archive contains only empty storage directories. Runtime data stays on host.
rm -rf "$RELEASE/storage"
ln -s "$LEGACY_APP/storage" "$RELEASE/storage"
ln -s "$LEGACY_APP/.env" "$RELEASE/.env"
chmod 755 "$RELEASE" "$RELEASE/bootstrap/cache"
mkdir -p "$PUBLIC_ROOT/_releases/$RELEASE_ID/assets"
chmod 755 "$PUBLIC_ROOT/_releases" "$PUBLIC_ROOT/_releases/$RELEASE_ID" "$PUBLIC_ROOT/_releases/$RELEASE_ID/assets"
rsync -a --chmod=D755,F644 "$RELEASE/public/assets/" "$PUBLIC_ROOT/_releases/$RELEASE_ID/assets/"
export PUBLIC_STORAGE_ROOT="$PUBLIC_ROOT/storage"
export ASSET_URL="${BASE_URL%/}/_releases/$RELEASE_ID"
cd "$RELEASE"
"$PHP_BIN" artisan config:clear
"$PHP_BIN" artisan migrate --force --no-interaction
"$PHP_BIN" artisan config:cache
# Verify the effective upload destination before routing requests to this release.
"$PHP_BIN" -r '$c=require "bootstrap/cache/config.php"; if (($c["filesystems"]["disks"]["public"]["root"]??null)!==getenv("PUBLIC_STORAGE_ROOT")) {fwrite(STDERR,"Public storage configuration mismatch\n");exit(1);}'
"$PHP_BIN" artisan view:cache
"$PHP_BIN" -r '$s=file_get_contents($argv[1]); file_put_contents($argv[2],str_replace("DEPLOY_ROOT_LITERAL",var_export($argv[3],true),$s));' "$INCOMING/front-controller.php" "$PUBLIC_ROOT/.index-deploy.php" "$DEPLOY_ROOT"
chmod 644 "$PUBLIC_ROOT/.index-deploy.php"
"$PHP_BIN" -l "$PUBLIC_ROOT/.index-deploy.php"
cp "$PUBLIC_ROOT/index.php" "$DEPLOY_ROOT/backups/index-$RELEASE_ID.php"
OLD=$(cat "$DEPLOY_ROOT/current" 2>/dev/null || true)
SWITCHED=0
rollback() {
  code=$?
  if [[ "$SWITCHED" == 1 ]]; then
    if [[ -n "$OLD" ]]; then
      printf '%s\n' "$OLD" > "$DEPLOY_ROOT/.current-rollback"
      mv -f "$DEPLOY_ROOT/.current-rollback" "$DEPLOY_ROOT/current"
    else
      cp "$DEPLOY_ROOT/backups/index-$RELEASE_ID.php" "$PUBLIC_ROOT/.index-rollback.php"
      chmod 644 "$PUBLIC_ROOT/.index-rollback.php"
      mv -f "$PUBLIC_ROOT/.index-rollback.php" "$PUBLIC_ROOT/index.php"
      rm -f "$DEPLOY_ROOT/current"
    fi
    echo 'Health check failed; previous code restored. Database migrations are not reversed.' >&2
  fi
  exit "$code"
}
trap rollback ERR
printf '%s\n' "$RELEASE_ID" > "$DEPLOY_ROOT/.current-next"
SWITCHED=1
mv -f "$DEPLOY_ROOT/.current-next" "$DEPLOY_ROOT/current"
mv -f "$PUBLIC_ROOT/.index-deploy.php" "$PUBLIC_ROOT/index.php"
for route in / /products; do
  curl --fail --silent --show-error --retry 2 --max-time 30 \
    -H 'Cache-Control: no-cache' -D "$INCOMING/health-headers" \
    "${BASE_URL%/}${route}?deploy_check=$RELEASE_ID" -o /dev/null
  tr -d '\r' < "$INCOMING/health-headers" | grep -Fqi "X-Luxurry-Release: $RELEASE_ID"
done
trap - ERR
if [[ -n "$OLD" ]]; then printf '%s\n' "$OLD" > "$DEPLOY_ROOT/previous"; fi
echo "Deployed release $RELEASE_ID. Environment, public uploads and server rules preserved."
