from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render, redirect, render_to_response

from api.models import MaintenanceRecord, MaintenanceNotice
def replace_with_br(x):
    return x.replace("\n", "<br/>")

def replace_html(x):
    message = replace_with_br(x.message)
    return { 
        'message': message,
    }
    
def get_maintenance(request):
    """
    Returns a list of maintenance records along with a boolean to indicate
    whether or not login should be disabled
    """
    records = MaintenanceRecord.active()
    disable_login = MaintenanceRecord.disable_login_access(request)
    in_maintenance = records.count() >= 1
    # FIXME: Avoid moving QuerySet -> list
    clean_records = list(map(replace_html, records))
    return (clean_records, disable_login, in_maintenance)


def get_notice(request):
    """
    Returns a notice indicating details about a forthcoming maintenance period
    """
    notices = MaintenanceNotice.active()
    has_notice = notices.count() > 0

    notice = {}
    if has_notice:
        model = notices[0]
        notice['title'] = model.title
        notice['message'] = model.message

    return (has_notice, notice)


def maintenance(request):
    records, disabled, in_maint = get_maintenance(request)

    if not disabled:
        return redirect("/login")

    template_params = {}

    template_params['ORG_NAME'] = settings.ORG_NAME
    template_params['SITE_TITLE'] = settings.SITE_TITLE
    template_params['SITE_FOOTER'] = settings.SITE_FOOTER
    template_params["records"] = records
    template_params["disable_login"] = disabled
    if hasattr(settings, "BASE_URL"):
        template_params['BASE_URL'] = settings.BASE_URL

    return render_to_response(
        'login.html',
        template_params,
    )


def atmo_maintenance(request):
    """
    Returns a splash screen to show that Atmosphere is currently under maintenance
    """
    return maintenance(request)
