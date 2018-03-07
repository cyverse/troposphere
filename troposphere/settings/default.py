"""
Django settings for troposphere project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

UI_VERSION = "v33"

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
BASE_URL = ""

SERVER_URL="https://localhost"

DEBUG = False

APPEND_SLASH = False

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'rest_framework',
    'rest_framework.authtoken',
    'raven.contrib.django.raven_compat',
    'webpack_loader', # resolved JS asset + hash for template rendering
    'django_cyverse_auth',
    'api',
    'troposphere',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'troposphere.slash_middleware.RemoveSlashMiddleware',
)

ROOT_URLCONF = 'troposphere.urls'

WSGI_APPLICATION = 'troposphere.wsgi.application'

DATABASES = {}

AUTH_USER_MODEL = 'troposphere.TroposphereUser'

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Templates
# https://docs.djangoproject.com/en/1.9/ref/templates/upgrading/
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                # Insert your TEMPLATE_CONTEXT_PROCESSORS here or use this
                # list if you haven't customized them:
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
            'debug': False
        },
    }
]

# Sessions
# Cookie-based sessions. Cookies are cryptographically signed.
SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'

# https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-SESSION_SERIALIZER
# Without this setting, a leakage of the secret key results in a remote
# code execution vulnerability. So keep this.
SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'

SESSION_COOKIE_NAME = 'tropo_sessionid'

CSRF_COOKIE_NAME = 'tropo_csrftoken'

# default cookie age to # of seconds in 2 days
SESSION_COOKIE_AGE = (2 * 24 * 60 * 60)

# default an emulated session to # of seconds in 3 hours
EMULATED_SESSION_COOKIE_AGE = (3 * 60 * 60)

# Logging
LOGGING_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'logs')
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(asctime)s %(name)s-%(levelname)s [%(pathname)s:%(lineno)d] %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(LOGGING_ROOT, 'troposphere.log'),
            'formatter': 'verbose',
        },
    },
    'loggers': {
        '': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

API_ROOT    = SERVER_URL + "/api/v1"
API_V2_ROOT = SERVER_URL + "/api/v2"

# The endpoint in troposphere for generated assets
STATIC_URL = '/assets/'

# The target location where static files are moved
STATIC_ROOT = os.path.join(BASE_DIR, "assets")

REST_FRAMEWORK = {
    # 'DEFAULT_RENDERER_CLASSES': (
    #     # Included Renderers
    #     'rest_framework.renderers.JSONRenderer',
    #     'rest_framework.renderers.JSONPRenderer',
    #     'rest_framework.renderers.BrowsableAPIRenderer',
    #     'rest_framework.renderers.YAMLRenderer',
    #     'rest_framework.renderers.XMLRenderer'
    # ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'django_cyverse_auth.authBackends.OAuthTokenLoginBackend'
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100,
    # 'DEFAULT_FILTER_BACKENDS': (
    #     # 'rest_framework.filters.DjangoFilterBackend',
    #     'rest_framework_filters.backends.DjangoFilterBackend',
    #     'rest_framework.filters.SearchFilter'
    # ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'django_cyverse_auth.authBackends.OAuthLoginBackend'
)

# This Method will generate SECRET_KEY and write it to file..
def generate_secret_key(secret_key_path):
    """
    Generates a unique `SECRET_KEY` upon each service start

    Used by Django in various ways. Notably, it is used to sign session
    cookies holding sensitive information about users & session values.

    For more details:
    - https://docs.djangoproject.com/en/1.9/ref/settings/#std:setting-SECRET_KEY
    """
    from django.utils.crypto import get_random_string
    from datetime import datetime
    chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)'
    secret_value = get_random_string(50, chars)
    comment_block = "\"\"\"\nThis file was Auto-Generated on %s\n\"\"\"\n" % datetime.now()
    with open(secret_key_path, "w") as key_file:
        key_file.write(comment_block)
        key_file.write("SECRET_KEY=\"%s\"\n" % secret_value)

# This import will Use an existing SECRET_KEY, or Generate your SECRET_KEY
# if it doesn't exist yet.
try:
    from .secret_key import SECRET_KEY
except ImportError:
    SETTINGS_DIR = os.path.abspath(os.path.dirname(__file__))
    generate_secret_key(os.path.join(SETTINGS_DIR, 'secret_key.py'))
    try:
        from .secret_key import SECRET_KEY
    except ImportError:
        raise Exception(
            "default.py could not generate a SECRET_KEY in secret_key.py")
