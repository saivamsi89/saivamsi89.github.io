#!/bin/bash
# Runs the Bluehost package on Apache + PHP (Docker) and checks dashboard, forms and security.
#   npm run package && tests/bluehost_check.sh
set -e
cd "$(dirname "$0")/.."
SITE=$(mktemp -d)
cp -r dist-bluehost/. "$SITE/"
sed "s/CHANGE-ME/test-setup-key-123/" "$SITE/private/config.sample.php" > "$SITE/private/config.php"
chmod -R 777 "$SITE"
docker rm -f nf-bluehost >/dev/null 2>&1 || true
docker run -d --name nf-bluehost -p 127.0.0.1:8719:80 -v "$SITE":/var/www/html --entrypoint bash wordpress:php8.2-apache -c '
  a2enmod rewrite headers deflate >/dev/null
  printf "<Directory /var/www/html>\nAllowOverride All\n</Directory>\n" > /etc/apache2/conf-enabled/zz.conf
  printf "upload_max_filesize=12M\npost_max_size=14M\nsendmail_path=\"/bin/sh -c '\''cat >> /tmp/mail.txt'\''\"\n" > /usr/local/etc/php/conf.d/zz.ini
  exec apache2-foreground' >/dev/null
trap 'docker rm -f nf-bluehost >/dev/null 2>&1' EXIT
for i in $(seq 1 60); do curl -s -o /dev/null http://localhost:8719/ && break; sleep 1; done
python3 tests/bluehost_check.py
