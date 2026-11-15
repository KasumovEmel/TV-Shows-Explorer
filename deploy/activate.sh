#!/usr/bin/env bash
set -euo pipefail
sha=${1:?release SHA required}
origin=${2:?public HTTPS origin required}
archive=${3:?release archive required}
[[ $sha =~ ^[a-f0-9]{40}$ && $origin =~ ^https://season-one\.duckdns\.org(:[0-9]+)?$ ]]
base=/srv/season-one
unit=season-one.service
exec 9>"$base/.release.lock"
flock -x 9
previous=""
if [[ -L $base/current ]]; then previous=$(readlink -f "$base/current"); fi
release="$base/releases/$sha"
stage=$(mktemp -d "$base/releases/.incoming.XXXXXXXX")
trap 'rm -rf -- "$stage"' EXIT
probe() {
  local expected=$1
  local options=(--silent --show-error --fail --connect-timeout 4 --max-time 12)
  [[ $(curl "${options[@]}" "$origin/revision.txt") == "$expected" ]] &&
    curl "${options[@]}" "$origin/" | grep -q 'id="root"' &&
    curl "${options[@]}" "$origin/favorites" | grep -q 'id="root"' &&
    curl "${options[@]}" -D "$stage/headers" "$origin/api/health" | grep -q '"status":"ok"' &&
    grep -iq "^x-release-revision: $expected" "$stage/headers" &&
    [[ $(curl -sS --max-time 10 -o "$stage/missing" -w '%{http_code}' "$origin/api/missing") == 404 ]] &&
    grep -q '"code":"not_found"' "$stage/missing"
}
switch_to() {
  ln -s "$1" "$stage/next"
  mv -Tf "$stage/next" "$base/current"
}
if [[ $previous == "$release" ]] && probe "$sha"; then
  exit 0
fi
if [[ ! -d $release ]]; then
  mkdir "$stage/release"
  tar -xzf "$archive" -C "$stage/release"
  [[ $(cat "$stage/release/web/revision.txt") == "$sha" ]]
  test -s "$stage/release/web/index.html"
  /opt/season-one/node/bin/node --check "$stage/release/server.mjs"
  printf 'RELEASE_SHA=%s\n' "$sha" > "$stage/release/release.env"
  chmod 755 "$stage/release"
  mv "$stage/release" "$release"
fi
if [[ -f $base/data/catalog.sqlite ]]; then
  (
    umask 077
    backups="$base/backups"
    pending="$backups/.next"
    mkdir -p "$pending"
    trap 'rm -f -- "$pending"/catalog.sqlite{,-wal,-shm,-journal}; rmdir -- "$pending"' EXIT
    sqlite3 "$base/data/catalog.sqlite" ".timeout 10000" ".backup '$pending/catalog.sqlite'"
    [[ $(sqlite3 "$pending/catalog.sqlite" 'PRAGMA quick_check;') == ok ]]
    mv -fT -- "$pending/catalog.sqlite" "$backups/latest.sqlite"
    find "$backups" -maxdepth 1 -type f -name '*.sqlite' ! -name latest.sqlite -delete
  )
fi
switch_to "$release"
if sudo -n systemctl restart "$unit"; then
  for _ in {1..10}; do
    if probe "$sha"; then exit 0; fi
    sleep 2
  done
fi
if [[ -d $previous && $previous != "$release" ]]; then
  switch_to "$previous"
  sudo -n systemctl restart "$unit"
  for _ in {1..10}; do
    if probe "$(basename "$previous")"; then echo 'Previous release restored' >&2; exit 1; fi
    sleep 2
  done
  echo 'Previous release failed readiness' >&2
else
  sudo -n systemctl stop "$unit"
  unlink "$base/current"
fi
exit 1
