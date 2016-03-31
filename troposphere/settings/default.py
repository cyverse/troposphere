"""
Django settings for troposphere project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""
UI_VERSION = "Larping Loon"

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
BASE_URL = ""

SERVER_URL="https://localhost"

DEBUG = False

TEMPLATE_DEBUG = False

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
    'iplantauth',
    'api',
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

# The ROOT PATH for ALL (app + dependencies) static files.
STATIC_ROOT = os.path.join(BASE_DIR, "assets")
# The SERVER PATH for ALL (app + dependencies) static files.
STATIC_URL = '/assets/'

#STATIC generated files from troposphere to be added to STATIC_ROOT

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
        'iplantauth.authBackends.OAuthTokenLoginBackend'
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
    'iplantauth.authBackends.OAuthLoginBackend'
)
