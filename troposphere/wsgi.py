"""
WSGI config for troposphere project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

import os
import sys

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, '/opt/env/troposphere/lib/python2.7/site-packages')
sys.path.insert(1, root_dir)

def application(environ, start_response):
    os.environ['DJANGO_SETTINGS_MODULE'] = environ['DJANGO_SETTINGS_MODULE']
    from django.core.wsgi import get_wsgi_application
    try:
        _application = get_wsgi_application()
    except Exception, e:
        e.msg = os.path.dirname(__file__)
        raise e
    return _application(environ, start_response)
