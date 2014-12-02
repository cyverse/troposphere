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

try:
    import newrelic.agent
    newrelic.agent.initialize(
      os.path.join(root_dir, "extras/newrelic/troposphere_newrelic.ini"),
      "staging")
except ImportError:
    logger.warn("New Relic not installed. To monitor this server, pip install newrelic")
    pass

os.environ["DJANGO_SETTINGS_MODULE"] = "troposphere.settings"

from django.core.wsgi import get_wsgi_application
try:
    application = get_wsgi_application()
except Exception, e:
    raise e
