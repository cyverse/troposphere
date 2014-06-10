import os
import logging
import requests

from datetime import datetime

from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.urlresolvers import reverse

from caslib import OAuthClient as CAS_OAuthClient

logger = logging.getLogger(__name__)

key = open(settings.OAUTH_PRIVATE_KEY_PATH, 'r').read()
cas_oauth_client = CAS_OAuthClient(settings.CAS_SERVER,
                           settings.OAUTH_CLIENT_CALLBACK,
                           settings.OAUTH_CLIENT_KEY,
                           settings.OAUTH_CLIENT_SECRET,
                           auth_prefix="/castest")

def root(request):
    return redirect('application')

def application(request):
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
    if 'redirect_to' in request.GET:
      request.session['redirect_to'] = request.GET['redirect_to']
    return redirect(cas_oauth_client.authorize_url())

def logout(request):
    request.session.flush()
    return redirect('application')

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

    if 'redirect_to' in request.session:
      return redirect(request.session['redirect_to'])
    return redirect('application')

def emulate(request, username):
    if 'access_token' not in request.session:
        return redirect(cas_oauth_client.authorize_url())

    if 'emulator_token' in request.session:
        old_token = request.session['emulator_token']
    else:
        old_token = request.session['access_token']
    if not username:
        #Restore the 'old token'
        logger.info("Session_token: %s. Request to remove emulation."
                 % (old_token, ))
        request.session['access_token'] = old_token
        return redirect('application')

    logger.info("Session_token: %s. Request to emulate %s."
                 % (old_token, username))

    r = requests.get(
            os.path.join(settings.SERVER_URL,
                         "api/v1/token_emulate/%s" % username),
            headers={'Authorization':'Bearer %s' % old_token})
    try:
        j_data = r.json()
    except ValueError:
        logger.warn("The API server returned non-json data(Error) %s" % r.text)
        return redirect('application')

    new_token = j_data.get('token')
    emulated_by = j_data.get('emulated_by')
    if not new_token or not emulated_by:
        logger.warn("The API server returned data missing the key(s) "
                "token/emulated_by. Data: %s" % j_data)
        return redirect('application')

    logger.info("User %s (Token: %s) has emulated User %s (Token:%s)"
                % (emulated_by, old_token, username, new_token))

    request.session['emulator_token'] = old_token
    request.session['access_token'] = new_token
    return redirect('application')

def forbidden(request):
    """
    View used when someone tries to log in and is an authenticated iPlant
    user, but was found to be unauthorized to use Atmosphere by OAuth.
    Returns HTTP status code 403 Forbidden
    """
    return render(request, 'no_user.html', status=403)
