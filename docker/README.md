# Troposphere


This container runs Troposphere and Nginx.


If using local development branch of secrets, Troposphere is run using Django's `runserver` command and webpack dev server instead of uWSGI in order to enable automatic rebuild of changes to Python or Javascript code.


The Dockerfile is based on Ubuntu 14.04 and installs dependencies and static configuration files. It also creates the Troposphere virtualenv but does not install anything to it. Since Troposphere code and secrets are added at runtime, the entrypoint script will:

  1. Ensure all required repos are present
  2. Pip install requirements in virtualenv
  3. Link Troposphere ini file from secrets and run `./configure` script
  4. Run Django migrations
  5. Install npm requirements
  6. Link correct Nginx config depending on environment and start Nginx
  7. If using development environment, the `web_desktop.py` view is modified to change the URL returned by a Guacamole connection so that it works on localhost
  8. Builds npm and starts uWSGI if using in production, or starts Django `runserver` and webpack dev server if using locally
