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


def _handle_public_application_request(request, maintenance_records, disabled_login=False):
    show_troposphere_only = hasattr(settings, "SHOW_TROPOSPHERE_ONLY") and settings.SHOW_TROPOSPHERE_ONLY is True

    template_params = {
        'access_token': request.session.get('access_token'),
        'emulator_token': request.session.get('emulator_token'),
        'emulated_by': request.session.get('emulated_by'),
        'records': maintenance_records,
        'disable_login': disabled_login,
        'show_troposphere_only': show_troposphere_only
    }

    if hasattr(settings, "API_ROOT"):
        template_params['API_ROOT'] = settings.API_ROOT

    if hasattr(settings, "API_V2_ROOT"):
        template_params['API_V2_ROOT'] = settings.API_V2_ROOT

    # If beta flag in query params, set the session value to that
    if "beta" in request.GET:
        request.session['beta'] = request.GET['beta'].lower()

    # If beta flag not defined, default it to false to show the old UI
    if "beta" not in request.session:
        request.session['beta'] = 'false'

    # Return the new Troposphere UI
    if request.session['beta'] == 'true' or show_troposphere_only:
        response = render_to_response(
            'index.html',
            template_params,
            context_instance=RequestContext(request)
        )

    # Return the old Airport UI
    else:
        response = render_to_response(
            'login.html',
            template_params,
            context_instance=RequestContext(request)
        )

    response.set_cookie('beta', request.session['beta'])
    return response


def _handle_authenticated_application_request(request, maintenance_records):
    show_troposphere_only = hasattr(settings, "SHOW_TROPOSPHERE_ONLY") and settings.SHOW_TROPOSPHERE_ONLY is True

    template_params = {
        'access_token': request.session.get('access_token'),
        'emulator_token': request.session.get('emulator_token'),
        'emulated_by': request.session.get('emulated_by'),
        'records': maintenance_records,
        'disable_login': False,
        'show_troposphere_only': show_troposphere_only
    }

    if hasattr(settings, "INTERCOM_APP_ID"):
        template_params['intercom_app_id'] = settings.INTERCOM_APP_ID
        template_params['intercom_company_id'] = settings.INTERCOM_COMPANY_ID
        template_params['intercom_company_name'] = settings.INTERCOM_COMPANY_NAME

    if hasattr(settings, "API_ROOT"):
        template_params['API_ROOT'] = settings.API_ROOT

    if hasattr(settings, "API_V2_ROOT"):
        template_params['API_V2_ROOT'] = settings.API_V2_ROOT

    user_preferences, created = UserPreferences.objects.get_or_create(user=request.user)

    # If beta flag in query params, set the session value to that
    if "beta" in request.GET:
        request.session['beta'] = request.GET['beta'].lower()
        show_beta_interface = True if request.session['beta'] == 'true' else False
        user_preferences.show_beta_interface = show_beta_interface
        user_preferences.save()
        return redirect('application')

    # Return the new Troposphere UI
    if user_preferences.show_beta_interface or show_troposphere_only:
        response = render_to_response(
            'application.html',
            template_params,
            context_instance=RequestContext(request)
        )

    # Return the old Airport UI
    else:
        response = render_to_response(
            'cf2.html',
            template_params,
            context_instance=RequestContext(request)
        )

    return response

STAFF_LIST_USERNAMES = ['estevetest01', 'estevetest02','estevetest03','estevetest04',
                        'estevetest13', 'sgregory', 'lenards', 'tharon', ]
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
    return render(request, 'no_user.html', status=403)


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

