#!/usr/bin/env bash
set -Eeuo pipefail

err_report() {
  echo "errexit ($1) on line $2" >&2
}
trap 'err_report $? ${LINENO}' ERR

cd /var/www

# Clean up and extract application
echo "Begin : Unarchive archiveslgbtqi webapp"
tar xvf /application.tar.gz
echo "End : Unarchive archiveslgbtqi webapp"

npx next start -H "${HOST:-0.0.0.0}" -p "${PORT:-3000}"
