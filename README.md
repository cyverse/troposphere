Troposphere
===========

```bash
cp troposphere/troposphere.cfg.dist troposphere/troposphere.cfg
```

Edit `troposphere.cfg` with your own settings. You'll have to generate a new
SSL keypair from Groupy for the Troposphere application. The configuration
variable `OAUTH_PRIVATE_KEY` should refer to the absolute path of that key.

```bash
pip install -r requirements.txt
python troposphere/__init__.py
```
