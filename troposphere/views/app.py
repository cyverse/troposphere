import json
import logging

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render, redirect, render_to_response
from django.template import RequestContext

from troposphere.version import get_version
from api.models import UserPreferences, MaintenanceRecord

logger = logging.getLogger(__name__)
from .maintenance import get_maintenance


def root(request):
    return redirect('application')

#TODO: Move this into a settings file.
STAFF_LIST_USERNAMES = ['estevetest01', 'estevetest02','estevetest03','estevetest04',
                        'estevetest13', 'sgregory', 'lenards', 'tharon', ]


def _should_show_troposphere_only():
    # `SHOW_TROPOSPHERE_ONLY` may not be present in `settings`, so use
    # `hasattr` to handle when it is not present & avoid 500 errors on load.
    return hasattr(settings, "SHOW_TROPOSPHERE_ONLY") and settings.SHOW_TROPOSPHERE_ONLY is True


def _populate_template_params(request, maintenance_records, disabled_login, public=False):
    """
    Creates a dict of parameters for later template merge given the arguments,
    request session, and django settings (defined in `default.py` or overidden
    in `local.py`).
    """
    show_troposphere_only = _should_show_troposphere_only()

    template_params = {
        'access_token': request.session.get('access_token'),
        'emulator_token': request.session.get('emulator_token'),
        'emulated_by': request.session.get('emulated_by'),
        'records': maintenance_records,
        'show_troposphere_only': show_troposphere_only,
        'show_public_site': public
    }

    show_instance_metrics = getattr(settings, "SHOW_INSTANCE_METRICS", False)

    if public:
        template_params['disable_login'] = disabled_login
    else:
        logger.info("public was false... ")
        template_params['disable_login'] = False
        template_params['show_instance_metrics'] = show_instance_metrics
        # Only include Intercom information when rendering the authenticated
        # version of the site.
        if hasattr(settings, "INTERCOM_APP_ID"):
            template_params['intercom_app_id'] = settings.INTERCOM_APP_ID
            template_params['intercom_company_id'] = settings.INTERCOM_COMPANY_ID
            template_params['intercom_company_name'] = settings.INTERCOM_COMPANY_NAME

    template_params['SITE_TITLE'] = settings.SITE_TITLE
    template_params['SITE_FOOTER'] = settings.SITE_FOOTER
    template_params['UI_VERSION'] = settings.UI_VERSION
    template_params['BADGE_HOST'] = getattr(settings, "BADGE_HOST", None)

    #TODO: Replace this line when theme support is re-enabled.
    #template_params["THEME_URL"] = "assets/"
    template_params["THEME_URL"] = "/themes/%s" % settings.THEME_NAME

    if hasattr(settings, "BASE_URL"):
        template_params['BASE_URL'] = settings.BASE_URL

    if hasattr(settings, "API_ROOT"):
        template_params['API_ROOT'] = settings.API_ROOT

    if hasattr(settings, "API_V2_ROOT"):
        template_params['API_V2_ROOT'] = settings.API_V2_ROOT

    return template_params, show_troposphere_only


def _handle_public_application_request(request, maintenance_records, disabled_login=False):
    template_params, show_troposphere_only = _populate_template_params(request,
            maintenance_records, disabled_login, True)

    # If show airport_ui flag in query params, set the session value to that
    if "airport_ui" in request.GET:
        request.session['airport_ui'] = request.GET['airport_ui'].lower()

    # If beta flag not defined, default it to false to show the old UI
    if "beta" not in request.session:
        request.session['beta'] = 'false'

    if "airport_ui" not in request.session:
        request.session['airport_ui'] = 'false'

    show_airport = request.session['airport_ui'] == 'true'

    # Return the new Troposphere UI
    if not show_airport or show_troposphere_only:
        response = render_to_response(
            'index.html',
            template_params,
            context_instance=RequestContext(request)
        )
    else: # Return the old Airport UI
        response = render_to_response(
            'login.html',
            template_params,
            context_instance=RequestContext(request)
        )

    response.set_cookie('beta', request.session['beta'])
    return response


def _handle_authenticated_application_request(request, maintenance_records):
    template_params, show_troposphere_only = _populate_template_params(request,
            maintenance_records, disabled_login=False, public=False)

    user_preferences, created = UserPreferences.objects.get_or_create(
        user=request.user)
    prefs_modified = False

    # TODO - once phased out, we should ignore show_beta_interface altogether
    # ----
    # If beta flag in query params, set the session value to that
    if "beta" in request.GET:
        prefs_modified = True
        request.session['beta'] = request.GET['beta'].lower()
        user_preferences.show_beta_interface = (True
            if request.session['beta'] == 'true' else False)
        user_preferences.show_beta_interface = show_beta_interface
        user_preferences.save()
        # should we be redirecting here?????
        return redirect('application')

    # Moving forward, the UI version shown will be controlled by
    # `airport_ui=<bool>` - and `beta` will be removed.
    if "airport_ui" in request.GET:
        prefs_modified = True
        request.session['airport_ui'] = request.GET['airport_ui'].lower()
        user_preferences.airport_ui = (True
            if request.session['airport_ui'] == 'true' else False)

    if prefs_modified:
        user_preferences.save()

    chose_airport = (user_preferences.airport_ui or
        not user_preferences.show_beta_interface)

    # show airport-ui if it's true and we are showing the option
    # of switching UIs
    # ----------
    # Return the old Airport UI
    if chose_airport and not show_troposphere_only:
        response = render_to_response(
            'cf2.html',
            template_params,
            context_instance=RequestContext(request)
        )
    else: # Return the new Troposphere UI
        response = render_to_response(
            'index.html',
            template_params,
            context_instance=RequestContext(request)
        )

    return response


def application_backdoor(request):
    response = HttpResponse()
    maintenance_records, disabled_login = get_maintenance(request)
    # This should only apply when in maintenance//login is disabled
    if not disabled_login or maintenance_records.count() == 0:
        return application(request)

    if request.user.is_authenticated() and request.user.username not in STAFF_LIST_USERNAMES:
        logger.warn('[Backdoor] %s is NOT in staff_list_usernames' % request.user.username)
        return redirect('maintenance')
    disabled_login = False
    maintenance_records = MaintenanceRecord.objects.none()
    if request.user.is_authenticated():
        return _handle_authenticated_application_request(request, maintenance_records)
    else:
        return _handle_public_application_request(request, maintenance_records, disabled_login=disabled_login)


def application(request):
    response = HttpResponse()
    maintenance_records, disabled_login = get_maintenance(request)

    if disabled_login and request.user.is_staff is not True and request.user.username not in STAFF_LIST_USERNAMES:
        logger.warn('[App] %s logged in but is NOT in staff_list_usernames' % request.user.username)
        return redirect('maintenance')
    if request.user.is_authenticated():
        return _handle_authenticated_application_request(request, maintenance_records)
    else:
        return _handle_public_application_request(request, maintenance_records, disabled_login=disabled_login)


def forbidden(request):
    """
    View used when someone tries to log in and is an authenticated iPlant
    user, but was found to be unauthorized to use Atmosphere by OAuth.
    Returns HTTP status code 403 Forbidden
    """
    # If banner message in query params, pass it into the template
    template_params = {}
    if "banner" in request.GET:
        template_params['banner'] = request.GET['banner']
    response = render_to_response(
        'no_user.html',
        template_params,
        context_instance=RequestContext(request)
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
