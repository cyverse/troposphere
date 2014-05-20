Troposphere
===========

Configuration
-------------

```bash
cp troposphere/settings/local.py.dist troposphere/settings/local.py
```

Edit `local.py` with your own settings. You'll have to generate a new
keypair from Groupy for the Troposphere application. The configuration
variable `OAUTH_PRIVATE_KEY_PATH` should refer to the absolute path of that key.

### Node.js

```bash
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install python-software-properties python g++ make nodejs
cd /path/to/troposphere
npm install -g gulp bower
npm install
bower install
```

### Ruby & SASS

```bash
sudo apt-get install ruby1.9.1
sudo gem install sass
```

### Virtualenv

```
mkdir -p /opt/env
virtualenv /opt/env/troposphere
source /opt/env/troposphere/bin/activate
pip install -r requirements.txt
```

### Static asset compilation
```bash
gulp
```


Development Server
------------------

```bash
python manage.py runserver 0.0.0.0:5000
````

The virtualenv directory is set to `/opt/env/troposphere/lib/python2.7/site-packages` by default.  If you'd like to change that for development, you can set the `VIRTUAL_ENV_PATH` environment variable to specify a different location.

Production Server
-----------------

There's an example Apache configuration file in etc/trosposhere.conf. Modify it
to your liking.

```bash
ln -s /opt/dev/troposphere/etc/troposphere.conf /etc/apache2/sites-available/troposphere.conf
a2ensite troposphere.conf
service apache2 reload
```

Troposphere should then be running on port `5000`.
