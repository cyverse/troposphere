Troposphere
===========

```bash
cp troposphere/settings/local.py.dist troposphere/settings/local.py
```

Edit `local.py` with your own settings. You'll have to generate a new
keypair from Groupy for the Troposphere application. The configuration
variable `OAUTH_PRIVATE_KEY_PATH` should refer to the absolute path of that key.

```bash
pip install -r requirements.txt
python manage.py runserver
```
