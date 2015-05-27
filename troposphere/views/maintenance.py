from django.shortcuts import render, redirect

from api.models import MaintenanceRecord


def get_maintenance(request):
    """
    Returns a list of maintenance records along with a boolean to indicate
    whether or not login should be disabled
    """
    records = MaintenanceRecord.active()
    disable_login = MaintenanceRecord.disable_login_access(request)
    return (records, disable_login)


def maintenance(request):
    records, disabled = get_maintenance(request)

    if not disabled:
        return redirect("/login")

    return render(request, 'login.html', {"records": records, "disable_login": disabled})


def atmo_maintenance(request):
    """
    Returns a splash screen to show that Atmosphere is currently under maintenance
    """
    return render(request, 'atmo_maintenance.html')