#!/bin/bash

function check_for_repo() {
  if test ! -d /opt/dev/$1/.git/
  then
    >&2 echo "ERROR: $1 repository does not exist and is required"
    return 1
  else
    echo "$1 repository exists. Continuing..."
    return 0
  fi
}

# Check that all necessary repositories exists
check_for_repo troposphere || exit 1
check_for_repo atmosphere-docker-secrets || exit 1

# Setup Troposphere
source /opt/env/troposphere/bin/activate && \
pip install -r /opt/dev/troposphere/requirements.txt

ln -s /opt/dev/atmosphere-docker-secrets/inis/troposphere.ini /opt/dev/troposphere/variables.ini
/opt/env/troposphere/bin/python /opt/dev/troposphere/configure

# Wait for DB to be active
echo "Waiting for postgres..."
while ! nc -z postgres 5432; do sleep 5; done

mkdir -p /opt/dev/troposphere/troposphere/tropo-static
/opt/env/troposphere/bin/python /opt/dev/troposphere/manage.py collectstatic --noinput --settings=troposphere.settings --pythonpath=/opt/dev/troposphere
/opt/env/troposphere/bin/python /opt/dev/troposphere/manage.py migrate --noinput --settings=troposphere.settings --pythonpath=/opt/dev/troposphere

cd /opt/dev/troposphere
npm install --unsafe-perm

source /opt/dev/atmosphere-docker-secrets/env

if [[ $env_type = "dev" ]]
then
  ln -s /etc/nginx/sites-available/site-dev.conf /etc/nginx/sites-enabled/site.conf
  nginx
  chown -R www-data:www-data /opt/dev/troposphere
  sed -i "s/^    url = .*$/    url = data.get('token_url').replace('guacamole','localhost',1)/" /opt/dev/troposphere/troposphere/views/web_desktop.py
  chown -R 1000:1000 /opt/dev/troposphere
  sudo su -l user -s /bin/bash -c "/opt/env/troposphere/bin/python /opt/dev/troposphere/manage.py runserver 0.0.0.0:8001 &"
  npm run serve -- --public localhost
else
  npm run build --production
  sed -i s/SERVER_NAME/$server_name/ /etc/nginx/sites-available/site-prod.conf
  ln -s /etc/nginx/sites-available/site-prod.conf /etc/nginx/sites-enabled/site.conf
  nginx
  sudo su -l www-data -s /bin/bash -c "UWSGI_DEB_CONFNAMESPACE=app UWSGI_DEB_CONFNAME=troposphere /opt/env/troposphere/bin/uwsgi --ini /usr/share/uwsgi/conf/default.ini --ini /etc/uwsgi/apps-enabled/troposphere.ini"
fi
