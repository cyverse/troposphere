"""
WSGI config for troposphere project.
It exposes the WSGI callable as a module-level variable named ``application``.
For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

import os
import sys

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

if os.environ.has_key("VIRTUAL_ENV_PATH"):
  virtual_env_path = os.environ["VIRTUAL_ENV_PATH"]
else:
  virtual_env_path = "/opt/env/troposphere/lib/python2.7/site-packages"

sys.path.insert(0, virtual_env_path)
sys.path.insert(1, root_dir)

# Warning! The DJANGO_SETTINGS_MODULE environment variable MUST be defined BEFORE "settings" is
# imported from django.conf because it depends on that variable. If you import "settings" BEFORE
# defining the environment variable you may get a 500 error
os.environ["DJANGO_SETTINGS_MODULE"] = "troposphere.settings"
from django.conf import settings

if settings.NEW_RELIC_CONFIGURED:
  try:
      import newrelic.agent
      from troposphere.settings import new_relic as new_relic_settings
      newrelic.agent.initialize(
        os.path.join(root_dir, "extras/newrelic/troposphere_newrelic.ini"),
        new_relic_settings.NEW_RELIC_ENVIRONMENT)
      print "[T]Plugin: New Relic initialized!"
  except ImportError, bad_import:
      print "[T]Warning: newrelic not installed.."
      print bad_import
  except Exception, bad_config:
      print "[T]Warning: newrelic not initialized.."
      print bad_config
else:
    print "[T]Plugin: Skipping New Relic setup. NEW_RELIC_ENVIRONMENT not defined in local.py"

from django.core.wsgi import get_wsgi_application
try:
    application = get_wsgi_application()
except Exception, e:
    raise e
