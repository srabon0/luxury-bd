#!/usr/bin/env bash
# Permanent cPanel cron worker. The FTP account is restricted to incoming/.
set -Eeuo pipefail
umask 077
fail() { echo "NOT READY: $*" >&2; exit 2; }
CONFIG=${1:?Pass the private configuration file}
[[ -f "$CONFIG" && ! -L "$CONFIG" ]] || fail 'Private configuration file is missing or is a symlink.'
# This file is installed by the owner outside the FTP account's root.
source "$CONFIG"
: "${DEPLOY_ROOT:?}" "${PUBLIC_ROOT:?}" "${LEGACY_APP:?}" "${PHP_BIN:?}" "${BASE_URL:?}"
for path in "$DEPLOY_ROOT" "$PUBLIC_ROOT" "$LEGACY_APP" "$PHP_BIN"; do
  [[ "$path" =~ ^/[a-zA-Z0-9_./-]+$ && "$path" != / && "$path" != *..* ]] || fail 'Invalid absolute path in config.sh.'
done
[[ "$BASE_URL" =~ ^https://[a-zA-Z0-9.-]+(:[0-9]+)?/?$ ]] || fail 'BASE_URL must be the canonical HTTPS origin.'
for tool in bash flock rsync curl tar sha256sum realpath; do command -v "$tool" >/dev/null || fail "Required command $tool is unavailable."; done
[[ -x "$PHP_BIN" ]] || fail 'PHP_BIN is not an executable file.'
[[ -f "$LEGACY_APP/.env" && -d "$LEGACY_APP/storage" ]] || fail 'The existing production environment/runtime storage was not found.'
[[ -f "$PUBLIC_ROOT/index.php" ]] || fail 'The public index.php was not found.'
[[ -d "$PUBLIC_ROOT/storage" && ! -L "$PUBLIC_ROOT/storage" ]] || fail 'Public storage must be a real directory, not a symbolic link.'
[[ -w "$PUBLIC_ROOT" && -w "$PUBLIC_ROOT/storage" && -w "$LEGACY_APP/storage" ]] || fail 'Public or runtime directories are not writable by this account.'
DEPLOY_ROOT=$(realpath "$DEPLOY_ROOT")
PUBLIC_ROOT=$(realpath "$PUBLIC_ROOT")
[[ "$DEPLOY_ROOT/" != "$PUBLIC_ROOT/"* ]] || fail 'DEPLOY_ROOT must be outside the public document root.'
"$PHP_BIN" -r 'exit(PHP_VERSION_ID >= 80400 ? 0 : 1);' || fail 'PHP 8.4 or newer is required.'
mkdir -p "$DEPLOY_ROOT/incoming" "$DEPLOY_ROOT/logs"
printf 'luxurry-ftps-agent-v1\n' > "$DEPLOY_ROOT/incoming/.agent-ready.tmp"
chmod 644 "$DEPLOY_ROOT/incoming/.agent-ready.tmp"
mv -f "$DEPLOY_ROOT/incoming/.agent-ready.tmp" "$DEPLOY_ROOT/incoming/AGENT_READY"
if [[ "${2:-}" == --check ]]; then
  echo 'READY: PHP 8.4, required commands, private configuration and real public upload directory checked.'
  exit 0
fi
exec 8>"$DEPLOY_ROOT/agent.lock"
flock -n 8 || exit 0
status() {
  printf '%s\n' "$2" > "$1/.STATUS.tmp"
  chmod 644 "$1/.STATUS.tmp"
  mv -f "$1/.STATUS.tmp" "$1/STATUS"
}
LAST_RUN=0 LAST_ATTEMPT=0
if [[ -f "$DEPLOY_ROOT/last-attempt" ]]; then
  read -r LAST_RUN LAST_ATTEMPT < "$DEPLOY_ROOT/last-attempt"
  [[ "$LAST_RUN" =~ ^[0-9]+$ && "$LAST_ATTEMPT" =~ ^[0-9]+$ ]] || exit 2
fi
CHOSEN='' CHOSEN_RUN=0 CHOSEN_ATTEMPT=0
shopt -s nullglob
for job in "$DEPLOY_ROOT"/incoming/*; do
  [[ -d "$job" && ! -L "$job" && -f "$job/READY" && ! -L "$job/READY" ]] || continue
  id=${job##*/}
  [[ "$id" =~ ^[0-9a-f]{40}-([0-9]{1,16})-([0-9]{1,6})$ ]] || continue
  run=$((10#${BASH_REMATCH[1]})) attempt=$((10#${BASH_REMATCH[2]}))
  [[ "$(cat "$job/READY")" == "$id" ]] || { status "$job" rejected; mv "$job/READY" "$job/REJECTED"; continue; }
  if (( run < LAST_RUN || (run == LAST_RUN && attempt <= LAST_ATTEMPT) )); then
    status "$job" superseded; mv "$job/READY" "$job/SUPERSEDED"; continue
  fi
  if (( run > CHOSEN_RUN || (run == CHOSEN_RUN && attempt > CHOSEN_ATTEMPT) )); then
    CHOSEN=$job CHOSEN_RUN=$run CHOSEN_ATTEMPT=$attempt
  fi
done
[[ -n "$CHOSEN" ]] || exit 0
id=${CHOSEN##*/}
mv "$CHOSEN/READY" "$CHOSEN/CLAIMED"
status "$CHOSEN" running
printf '%s %s\n' "$CHOSEN_RUN" "$CHOSEN_ATTEMPT" > "$DEPLOY_ROOT/.last-attempt.tmp"
mv "$DEPLOY_ROOT/.last-attempt.tmp" "$DEPLOY_ROOT/last-attempt"
finish() {
  code=$?
  if (( code != 0 )); then status "$CHOSEN" failed; fi
}
trap finish EXIT
# Validate the checksum manifest's filenames before invoking sha256sum.
declare -A seen=()
count=0
[[ -f "$CHOSEN/DEPLOY.SHA256" && ! -L "$CHOSEN/DEPLOY.SHA256" ]]
while read -r digest filename extra; do
  [[ "$digest" =~ ^[0-9a-f]{64}$ && -z "${extra:-}" ]] || exit 3
  case "$filename" in luxurry-staging.tar.gz|SHA256SUMS|activate-release.sh|front-controller.php) ;; *) exit 3 ;; esac
  [[ -z "${seen[$filename]:-}" && -f "$CHOSEN/$filename" && ! -L "$CHOSEN/$filename" ]] || exit 3
  seen[$filename]=1
  count=$((count+1))
done < "$CHOSEN/DEPLOY.SHA256"
[[ "$count" == 4 ]]
(cd "$CHOSEN" && sha256sum --check DEPLOY.SHA256) > "$DEPLOY_ROOT/logs/$id.log" 2>&1
if bash "$CHOSEN/activate-release.sh" "$DEPLOY_ROOT" "$PUBLIC_ROOT" "$LEGACY_APP" "$PHP_BIN" "$BASE_URL" "$id" >> "$DEPLOY_ROOT/logs/$id.log" 2>&1; then
  status "$CHOSEN" succeeded
else
  exit 1
fi
trap - EXIT
