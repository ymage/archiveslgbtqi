#!/usr/bin/env bash
set -Eeuo pipefail

err_report() {
  echo "errexit ($1) on line $2" >&2
}
trap 'err_report $? ${LINENO}' ERR

cd /var/www

npx next start -H "${HOST:-0.0.0.0}" -p "${PORT:-3000}"
