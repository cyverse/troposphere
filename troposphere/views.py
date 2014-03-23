from django.http import HttpResponse
from django.shortcuts import render, redirect

def root(request):
    return redirect('application')

def application(request):
    records, disabled_login = get_maintenance()
    if disabled_login:
        return redirect('maintenance')

    context = {}
    return render(request, 'application.html', context)

def get_maintenance():
    """
    Returns a list of maintenance records along with a boolean to indicate
    whether or not login should be disabled
    """
    return ([], False)

def maintenance(request):
    return HttpResponse("We're undergoing maintenance", status=503)
