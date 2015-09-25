from troposphere.settings.default import *
try:
    from troposphere.settings.local import *
except ImportError:
    raise Exception("No local settings module found. Refer to README.md")
