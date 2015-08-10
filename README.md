Troposphere
===========

## Configuration

```bash
cp troposphere/settings/local.py.dist troposphere/settings/local.py
```

Edit `local.py` with your own settings.

### Node.js

```bash
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install python-software-properties python g++ make nodejs
cd /path/to/troposphere
make
```

### Static asset compilation
```bash
npm install
npm run build
```

## Development Server


```bash
python manage.py runserver 0.0.0.0:5000
````

The virtualenv directory is set to `/opt/env/troposphere/lib/python2.7/site-packages` by default.  If you'd like to change that for development, you can set the `VIRTUAL_ENV_PATH` environment variable to specify a different location.

## Production Server

### nginx and uWSGI

**NOTE**: The setup below expects uWSGI is running in Emperor mode with
the vassals directory set to `/etc/uwsgi/apps-enabled`.

```bash
cd extras
mkdir -p /etc/uwsgi/apps-enabled/
ln -s $PWD/troposphere.uwsgi.ini /etc/uwsgi/apps-enabled/troposphere.ini
cd nginx
make
```

### Apache
There's an example Apache configuration file in etc/trosposhere.conf. Modify it
to your liking.

```bash
ln -s /opt/dev/troposphere/etc/troposphere.conf /etc/apache2/sites-available/troposphere.conf
a2ensite troposphere.conf
service apache2 reload
```


Troposphere should then be running on port `5000`.

## Contributing
Setup your environment by install all dependencies

```bash
npm install
```

It is recommended that you install the git `pre-commit` hook to ensure your code follows good style guidelines.

```bash
ln -s extras/pre-commit .git/hooks/pre-commit
```
