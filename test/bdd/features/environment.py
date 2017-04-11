"""
Defines common environment between each feature

- Note: nearly identical to environment.py included in operation-sanity

https://github.com/cyverse/operation-sanity/blob/master/features/environment.py
"""

import os

try:
    from urlparse import urlparse, urlunsplit
except ImportError:
    from urllib.parse import urlparse, urlunsplit

from behaving import environment as benv
from splinter import Browser

BEHAVE_DEBUG_ON_ERROR = False


def setup_debug_on_error(userdata):
    """
    Set debugging flag passed via `./behave` command-line executable

    Example:
    ```
    behave -D BEHAVE_DEBUG_ON_ERROR         (to enable  debug-on-error)
    # or
    behave -D BEHAVE_DEBUG_ON_ERROR=yes     (to enable  debug-on-error)
    ```

    The flag is disable by default.

    Approach pull from the behave tutorial [0]

    [0] https://pythonhosted.org/behave/tutorial.html#debug-on-error-in-case-of-step-failures
    """
    global BEHAVE_DEBUG_ON_ERROR #pylint: disable=W0603
    BEHAVE_DEBUG_ON_ERROR = userdata.getbool("BEHAVE_DEBUG_ON_ERROR")


def get_base_url(url):
    """
    Get base URL from `url` argument

    The "base" is scheme + hostname, an example for secure sites:
    - https://github.com/ (given: https://github.com/settings/profile)
    """
    url_parts = urlparse(url)
    return urlunsplit((url_parts.scheme, url_parts.hostname, '', '', ''))


def before_all(context):
    setup_debug_on_error(context.config.userdata)
    benv.before_all(context)
    context.default_browser = os.environ.get('SANITYBROWSER', '')
    context.base_url = get_base_url(os.environ['SANITYURL'])

def after_all(context):
    benv.after_all(context)


def before_feature(context, feature):
    benv.before_feature(context, feature)


def after_feature(context, feature):
    benv.after_feature(context, feature)


def after_step(context, step):
    """
    Define actions to take after the completion of a step.

    Note: `behave` must be run with `-D BEHAVE_DEBUG_ON_ERROR` in order
    for the enter debugger "after step" failure to work.
    """
    if BEHAVE_DEBUG_ON_ERROR and step.status == "failed":
        import ipdb
        ipdb.post_mortem(step.exc_traceback)


def before_scenario(context, scenario):
    if 'persist_browser' not in scenario.tags:
        benv.before_scenario(context, scenario)


def after_scenario(context, scenario):
    if scenario.status == 'failed':
        print ("""
        Failed.

        Place a breakpoint within `after_scenario`, environment.py to
        inspect the context and scenario.
        """)

    if 'persist_browser' not in scenario.tags:
        benv.after_scenario(context, scenario)
