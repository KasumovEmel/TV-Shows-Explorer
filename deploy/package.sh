#!/usr/bin/env bash
set -euo pipefail
: "${GITHUB_SHA:?}"
[[ $GITHUB_SHA =~ ^[a-f0-9]{40}$ ]]
stage=$(mktemp -d)
trap 'rm -rf -- "$stage"' EXIT
cp -R apps/web/dist "$stage/web"
cp apps/server/dist/index.js "$stage/server.mjs"
printf '%s\n' "$GITHUB_SHA" > "$stage/web/revision.txt"
mkdir -p release
COPYFILE_DISABLE=1 tar -czf release/release.tar.gz -C "$stage" web server.mjs
cp deploy/{activate,upload}.sh release/
