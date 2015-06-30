from troposphere.settings.default import *
try:
    from troposphere.settings.local import *
except ImportError:
    raise Exception("No local settings module found. Refer to README.md")

HEADER_TEXT = 'Atmosphere'
LOGO = '/assets/images/mini_logo.png'
FAVICON = '/assets/images/favicon.ico'
CSS_FILE = '/assets/css/app/app.css'
FOOTER_TEXT = "iPlant Collaborative"