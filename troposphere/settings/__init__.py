from troposphere.settings.default import *
try:
    from troposphere.settings.local import *
except ImportError:
    raise Exception("No local settings module found. Refer to README.md")

THEME_HEADER_TEXT = 'Atmosphere'
THEME_LOGO = '/assets/images/mini_logo.png'
THEME_FAVICON = '/assets/images/favicon.ico'
THEME_CSS_FILE = '/assets/style.css'
THEME_FOOTER_TEXT = "iPlant Collaborative"
UI_VERSION = 'Hawaiian Hawk'