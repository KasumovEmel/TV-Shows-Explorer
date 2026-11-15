#!/usr/bin/env bash
set -euo pipefail
: "${VPS_HOST:?}" "${VPS_USER:?}" "${VPS_PORT:?}" "${VPS_SSH_KEY:?}" "${VPS_KNOWN_HOSTS:?}" "${GITHUB_SHA:?}"
origin=${SITE_URL:-https://season-one.duckdns.org}
[[ $GITHUB_SHA =~ ^[a-f0-9]{40}$ && $origin =~ ^https://season-one\.duckdns\.org(:[0-9]+)?$ ]]
[[ $VPS_HOST =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ && $VPS_USER =~ ^[a-zA-Z_][a-zA-Z0-9_-]*$ && $VPS_PORT =~ ^[0-9]+$ ]]
umask 077
keys=$(mktemp -d)
trap 'rm -rf -- "$keys"' EXIT
printf '%s\n' "$VPS_SSH_KEY" > "$keys/key"
printf '%s\n' "$VPS_KNOWN_HOSTS" > "$keys/known_hosts"
opts=(-o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$keys/known_hosts" -i "$keys/key")
host="$VPS_USER@$VPS_HOST"
incoming=$(ssh "${opts[@]}" -p "$VPS_PORT" "$host" 'mktemp -d /srv/season-one/.upload.XXXXXXXX')
[[ $incoming =~ ^/srv/season-one/\.upload\.[a-zA-Z0-9]+$ ]]
cleanup(){ ssh "${opts[@]}" -p "$VPS_PORT" "$host" "rm -rf -- '$incoming'"; rm -rf -- "$keys"; }
trap cleanup EXIT
scp "${opts[@]}" -P "$VPS_PORT" release.tar.gz activate.sh "$host:$incoming/"
ssh "${opts[@]}" -p "$VPS_PORT" "$host" "bash '$incoming/activate.sh' '$GITHUB_SHA' '$origin' '$incoming/release.tar.gz'"
