import json
import logging

from datetime import timedelta
from urllib import urlencode
from urlparse import urlparse

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render, redirect, render_to_response
from django.utils import timezone

from api.models import UserPreferences, MaintenanceRecord
from troposphere.version import get_version
from troposphere.auth import has_valid_token
from troposphere.site_metadata import get_site_metadata
from .emulation import is_emulated_session
from .maintenance import get_maintenance, get_notice

logger = logging.getLogger(__name__)


if hasattr(settings, "MAINTENANCE_EXEMPT_USERNAMES"):
    MAINTENANCE_EXEMPT_USERNAMES = settings.MAINTENANCE_EXEMPT_USERNAMES
else:
    logger.error("""
        MAINTENANCE_EXEMPT_USERNAMES has not been set correctly.
        Help look at atmosphere/settings/local.py or
        add to variables.ini under [local.py] & re-run
        the ./configure script
    """)
    logger.warn("Adding fallback MAINTENANCE_EXEMPT_USERNAMES...")
    MAINTENANCE_EXEMPT_USERNAMES = [
        'sgregory', 'lenards', 'tharon',
        'cdosborn', 'julianp', 'amercer',
        'amitj', 'cmart', 'jchansen'
    ]


def root(request):
    return redirect('application')


def should_route_to_maintenace(request, in_maintenance):
    """
    Indicate if a response should be handled by the maintenance view.
    """
    return (in_maintenance
        and request.user.is_staff is not True
        and request.user.username not in MAINTENANCE_EXEMPT_USERNAMES
        and not is_emulated_session(request))


def _should_enabled_new_relic():
    return hasattr(settings, "NEW_RELIC_ENVIRONMENT") and \
        bool(settings.NEW_RELIC_ENVIRONMENT) is True


def _populate_template_params(request, maintenance_records, notice_t, disabled_login, public=False):
    """
    Creates a dict of parameters for later template merge given the arguments,
    request session, and django settings (defined in `default.py` or overidden
    in `local.py`).
    """
    # keep this variable around for the return statement ...
    enable_new_relic = _should_enabled_new_relic()
    notice = ""
    if notice_t and len(notice_t) > 2:
        notice = notice_t[1] if not notice_t[2] else None
    logger.info("maintenance notice tuple: {0}".format(notice_t))

    if 'access_token' not in request.session \
            and 'auth_token' in request.COOKIES:
        request.session['access_token'] = request.COOKIES['auth_token']

    emulator = request.session.get('emulator')

    auth_backends = settings.AUTHENTICATION_BACKENDS
    oauth_backends = [
        'django_cyverse_auth.authBackends.OAuthLoginBackend',
        'django_cyverse_auth.authBackends.GlobusOAuthLoginBackend'
    ]
    openstack_backends = [
        'django_cyverse_auth.authBackends.OpenstackLoginBackend',
    ]
    password_backends = [
        'django_cyverse_auth.authBackends.AuthTokenLoginBackend',
    ]
    login_auth_allowed = []
    login_auth_preferred = None
    for backend in auth_backends:
        login_auth_type = None
        auth_provider = None
        if backend in password_backends:
            login_auth_type = "password-login"
            auth_provider = "Atmosphere"
        elif backend in openstack_backends:
            login_auth_type = "openstack-login"
            auth_provider = "Openstack"
        elif backend == oauth_backends[0]:
            login_auth_type = "oauth-login"
            auth_provider = "CAS"
        elif backend == oauth_backends[1]:
            login_auth_type = "oauth-login"
            auth_provider = "Globus"
        if login_auth_type:
            login_auth_allowed.append({'method': login_auth_type, 'provider': auth_provider})
    use_login_selection = getattr(settings, "USE_LOGIN_SELECTION", False)
    template_params = {
        'access_token': request.session.get('access_token'),
        'use_login_selection': use_login_selection,
        'login_auth_allowed': login_auth_allowed,
        'org_name': settings.ORG_NAME,
        'show_instance_metrics': getattr(settings, "SHOW_INSTANCE_METRICS", False),
        'emulator_token': request.session.get('emulator_token'),
        'emulator': emulator,
        'records': maintenance_records,
        'notice': notice,
        'new_relic_enabled': enable_new_relic,
        'show_public_site': public
    }

    logger.info("Populated template: %s" % template_params)
    if public:
        template_params['disable_login'] = disabled_login
    else:
        template_params['disable_login'] = False
        # Only include Intercom information when rendering the authenticated
        # version of the site.
        if hasattr(settings, "INTERCOM_APP_ID"):
            template_params['intercom_app_id'] = settings.INTERCOM_APP_ID
            template_params['intercom_company_id'] = \
                settings.INTERCOM_COMPANY_ID
            template_params['intercom_company_name'] = \
                settings.INTERCOM_COMPANY_NAME
            template_params['intercom_options'] = \
                json.dumps(settings.INTERCOM_OPTIONS)

    if enable_new_relic:
        template_params['new_relic_browser_snippet'] = \
            settings.NEW_RELIC_BROWSER_SNIPPET

    enable_sentry = getattr(settings, 'SENTRY_DSN',"") != ""
    server_prefix = urlparse(settings.SERVER_URL).netloc.split('.')[0]
    sentry_tags = {'server_name': server_prefix}
    if emulator:
        sentry_tags['emulator'] = str(emulator)

    template_params['SITE_TITLE'] = settings.SITE_TITLE
    template_params['SITE_FOOTER'] = settings.SITE_FOOTER
    template_params['SUPPORT_EMAIL'] = settings.SUPPORT_EMAIL
    template_params['UI_VERSION'] = settings.UI_VERSION
    template_params['BADGE_HOST'] = getattr(settings, "BADGE_HOST", None)
    template_params['USE_MOCK_DATA'] = getattr(settings, "USE_MOCK_DATA", False)
    template_params['USE_ALLOCATION_SOURCES'] = getattr(settings,
            "USE_ALLOCATION_SOURCES", False)
    template_params['ORG_NAME'] = settings.ORG_NAME
    template_params['DYNAMIC_ASSET_LOADING'] = settings.DYNAMIC_ASSET_LOADING
    template_params['SENTRY_ENABLED'] = enable_sentry
    template_params['sentry_tags_dict'] = sentry_tags
    template_params['collect_analytics'] = getattr(settings,
            "COLLECT_ANALYTICS", False)


    if hasattr(settings, "BASE_URL"):
        template_params['BASE_URL'] = settings.BASE_URL

    metadata = get_site_metadata()

    template_params['DISPLAY_STATUS_PAGE'] = False
    template_params['WEB_DESKTOP_INCLUDE_LINK'] = \
        settings.WEB_DESKTOP_INCLUDE_LINK

    if metadata:
        template_params['DISPLAY_STATUS_PAGE'] = \
            metadata.display_status_page_link
        template_params['STATUS_PAGE_LINK'] = \
            metadata.status_page_link
        template_params['SITE_FOOTER_LINK'] = \
            metadata.site_footer_link
        template_params['SITE_FOOTER_HTML'] = \
            metadata.site_footer
        template_params['USER_PORTAL'] = \
            metadata.get_user_portal_as_json()

    if hasattr(settings, "API_ROOT"):
        template_params['API_ROOT'] = settings.API_ROOT

    if hasattr(settings, "API_V2_ROOT"):
        template_params['API_V2_ROOT'] = settings.API_V2_ROOT

    if hasattr(settings, "USE_GATE_ONE_API"):
        template_params['USE_GATE_ONE_API'] = settings.USE_GATE_ONE_API
        template_params['WEB_SH_URL'] = settings.WEB_SH_URL

    return template_params


def _handle_public_application_request(request, maintenance_records, disabled_login=False):
    """
    Deal with unauthenticated requests:
    - there is only the opportunity to browser the Public Image Catalog.

    """
    template_params = _populate_template_params(request, maintenance_records,
                                                None, disabled_login, True)

    if 'new_relic_enabled' in template_params:
        logger.info("New Relic enabled? %s" % template_params['new_relic_enabled'])
    else:
        logger.info("New Relic key missing from `template_params`")

    response = render_to_response(
        'index.html',
        template_params,
    )

    return response


def _handle_authenticated_application_request(request, maintenance_records,
        notice_info):
    """
    Deals with request verified identities via `django_cyverse_auth` module.
    """
    if notice_info and notice_info[1]:
        notice_info = (notice_info[0], notice_info[1],
            'maintenance_notice' in request.COOKIES)

    template_params = _populate_template_params(request, maintenance_records,
                                                notice_info,
                                                disabled_login=False,
                                                public=False)

    # UserPreferences currently do not have a reason to be fetched.
    # This model was used when we need to decide which user interface to
    # given what the community member preferred.
    #
    # I leave this for now as an example of how to fetch this model:
    # ---
    # user_preferences, created = UserPreferences.objects.get_or_create(
    #    user=request.user)

    if 'new_relic_enabled' in template_params:
        logger.info("New Relic enabled? %s" % template_params['new_relic_enabled'])
    else:
        logger.info("New Relic key missing from `template_params`")

    response = render_to_response(
        'index.html',
        template_params,
    )

    # Delete cookie after exchange
    if 'auth_token' in request.COOKIES:
        response.delete_cookie('auth_token')

    if 'maintenance_notice' not in request.COOKIES:
        response.set_cookie('maintenance_notice', 'true',
            expires=(timezone.now() + timedelta(hours=3)))

    return response


def application_backdoor(request):
    maintenance_records, _, in_maintenance = get_maintenance(request)
    # This should only apply when in maintenance//login is disabled
    if len(maintenance_records) == 0:
        logger.info('No maintenance, Go to /application - do not collect $100')
        return redirect('application')

    if request.user.is_authenticated() and request.user.username not in MAINTENANCE_EXEMPT_USERNAMES:
        logger.warn('[Backdoor] %s is NOT in staff_list_usernames' % request.user.username)
        return redirect('maintenance')

    # route a potential VIP to login
    query_arguments = {
        'redirect_to': '/application',
        'bsp': 'true'
    }
    # I'm on the Guest List! Backstage Pass!
    return redirect('/login?%s' % (urlencode(query_arguments),))



def application(request):
    maintenance_records, disabled_login, in_maintenance = \
        get_maintenance(request)
    notice_info = get_notice(request)

    if should_route_to_maintenace(request, in_maintenance):
        logger.warn('%s has actice session but is NOT in staff_list_usernames'
            % request.user.username)
        logger.warn('- routing user')
        return redirect('maintenance')
    if getattr(settings, "DISABLE_PUBLIC_AUTH", False):
        return _handle_authenticated_application_request(request,
            maintenance_records,
            notice_info)
    elif request.user.is_authenticated() and has_valid_token(request.user):
        return _handle_authenticated_application_request(request,
            maintenance_records,
            notice_info)
    else:
        return _handle_public_application_request(request, maintenance_records,
            disabled_login=disabled_login)


def forbidden(request):
    """
    View used when someone tries to log in and is an authenticated iPlant
    user, but was found to be unauthorized to use Atmosphere by OAuth.
    Returns HTTP status code 403 Forbidden
    """
    metadata = get_site_metadata()
    template_params = {}

    template_params['ORG_NAME'] = settings.ORG_NAME
    template_params['SITE_TITLE'] = settings.SITE_TITLE
    template_params['SITE_FOOTER'] = settings.SITE_FOOTER
    template_params['SUPPORT_EMAIL'] = settings.SUPPORT_EMAIL
    template_params['SITE_FOOTER_HTML'] = \
        metadata.site_footer
    template_params['USER_PORTAL_LINK'] = metadata.user_portal_link
    template_params['USER_PORTAL_LINK_TEXT'] = metadata.user_portal_link_text
    template_params['ACCOUNT_INSTRUCTIONS_LINK'] = \
        metadata.account_instructions_link

    if hasattr(settings, "BASE_URL"):
        template_params['BASE_URL'] = settings.BASE_URL

    # If banner message in query params, pass it into the template
    if "banner" in request.GET:
        template_params['banner'] = request.GET['banner']

    response = render_to_response(
        'no_user.html',
        template_params,
    )
    return response


def version(request):
    v = get_version()
    v["commit_date"] = v["commit_date"].isoformat()
    v_json = json.dumps(v)
    return HttpResponse(v_json, content_type='application/json')


def tests(request):

    template_params = {
        'test': request.GET['test'].lower()
    }

    return render(request, 'tests.html', template_params)
