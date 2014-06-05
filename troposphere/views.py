import logging
from datetime import datetime

from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.urlresolvers import reverse

from caslib import CASClient
from caslib import OAuthClient as CAS_OAuthClient
#from troposphere.ldap_client import LDAPClient

logger = logging.getLogger(__name__)

def get_cas_client(request):
    #Simple service validation setup
    service_url = ""
    if request:
        service_url = request.build_absolute_uri(reverse('cas_service'))
    return CASClient(settings.CAS_SERVER, service_url)

key = open(settings.OAUTH_PRIVATE_KEY_PATH, 'r').read()
cas_oauth_client = CAS_OAuthClient(settings.CAS_SERVER,
                           settings.OAUTH_CLIENT_CALLBACK,
                           settings.OAUTH_CLIENT_KEY,
                           settings.OAUTH_CLIENT_SECRET,
                           auth_prefix="/castest")
#ldap_client = LDAPClient(settings.LDAP_SERVER, settings.LDAP_SERVER_DN)

def root(request):
    return redirect('application')

def application(request):
    logger.debug("Application URL requested")
    records, disabled_login = get_maintenance()
    if disabled_login:
        return redirect('maintenance')

    if 'access_token' in request.session:
        template_params = {
           'access_token': request.session['access_token']
        }
        return render(request, 'application.html', template_params)
    else:
        return render(request, 'index.html')

def get_maintenance():
    """
    Returns a list of maintenance records along with a boolean to indicate
    whether or not login should be disabled
    """
    return ([], False)

def maintenance(request):
    return HttpResponse("We're undergoing maintenance", status=503)

def login(request):
    return redirect(cas_oauth_client.authorize_url())

def logout(request):
    root_url = request.build_absolute_uri(reverse('application'))
    return redirect(get_cas_client(request)._logout_url(root_url))

def cas_oauth_service(request):
    logger.debug("OAuth-CAS service request")
    if 'code' not in request.GET:
        #You should not be here, you should be at OAuth-wrapped CAS login.
        return redirect(cas_oauth_client.authorize_url())

    code_service_ticket = request.GET['code']
    token, expiry_date = cas_oauth_client.get_access_token(code_service_ticket)
    if not token:
        #code_service_ticket has expired (They don't last very long...)
        #Lets try again (Redirect to OAuth-wrapped CAS login)
        return redirect(cas_oauth_client.authorize_url())
    #Token is valid... Our work here is done.
    request.session['access_token'] = token
    return redirect('application')

def forbidden(request):
    """
    View used when someone tries to log in and is an authenticated iPlant
    user, but was found to be unauthorized to use Atmosphere by OAuth.
    Returns HTTP status code 403 Forbidden
    """
    return render(request, 'no_user.html', status=403)
