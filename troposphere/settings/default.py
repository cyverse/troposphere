"""
Django settings for troposphere project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

DEBUG = False

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = (
    'django.contrib.messages',
    'django.contrib.staticfiles',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
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
TEMPLATE_DIRS = [os.path.join(BASE_DIR, 'templates')]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "assets")
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'pipeline.finders.PipelineFinder',
)

# Django Pipeline
# http://django-pipeline.readthedocs.org/
STATICFILES_STORAGE = 'pipeline.storage.PipelineCachedStorage'
INSTALLED_APPS += ('pipeline',)
PIPELINE_CSS = {
    'application': {
        'source_filenames': (
            'css/layout.css',
            'css/header.css',
            'css/sidebar.css',
            'css/dashboard.css',
            'css/volumes.css',
            'css/settings.css',
            'css/applications.css',
            'css/global.css',
            'css/loading.css',
            'css/projects.css',
        ),
        'output_filename': 'css/application.css'
    }
}

PIPELINE_YUGLIFY_BINARY = os.path.join(os.path.dirname(BASE_DIR),
    'node_modules', 'yuglify', 'bin', 'yuglify')

PIPELINE_ENABLED = True
