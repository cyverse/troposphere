import logging
from datetime import datetime

from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.urlresolvers import reverse

from troposphere.cas import CASClient, InvalidTicket
from troposphere.oauth import OAuthClient, Unauthorized
import troposphere.messages as messages

logger = logging.getLogger(__name__)

def get_cas_client(request):
    return CASClient(settings.CAS_SERVER,
                     request.build_absolute_uri(reverse('cas_service')))

key = open(settings.OAUTH_PRIVATE_KEY_PATH, 'r').read()
oauth_client = OAuthClient(settings.OAUTH_SERVER,
                           key,
                           settings.OAUTH_ISS,
                           settings.OAUTH_SCOPE)
def root(request):
    return redirect('application')

def application(request):
    records, disabled_login = get_maintenance()
    if disabled_login:
        return redirect('maintenance')

    response = None
    for msg in messages.get_messages(request):
        if isinstance(msg, dict) and 'login_check' in msg:
            if 'access_token' in msg.keys():
                token = msg['access_token']
                response = render(request, 'application.html', {
                                  'access_token': token['value'],
                                  'expires': token['expires']})
            else:
                response = render(request, 'application.html')

    if response:
        return response

    flash = {'gatewayed': True, 'path': request.get_full_path()}
    messages.add_message(request, flash)
    return redirect(get_cas_client(request).get_login_endpoint(gateway=True))

def get_maintenance():
    """
    Returns a list of maintenance records along with a boolean to indicate
    whether or not login should be disabled
    """
    return ([], False)

def maintenance(request):
    return HttpResponse("We're undergoing maintenance", status=503)

def login(request):
    return redirect(get_cas_client(request).get_login_endpoint())

def logout(request):
    root_url = request.build_absolute_uri(reverse('application'))
    return redirect(get_cas_client(request).get_logout_endpoint(root_url))

def gateway_request(request):
    """
    Returns a tuple of the form (a, b) where a is true iff the preceeding
    request was an attempt to log in the use into CAS with gateway=true and b
    is the path that was originally requested on Troposphere.
    https://wiki.jasig.org/display/CAS/gateway
    """
    for m in messages.get_messages(request):
        if isinstance(m, dict) and m.has_key('gatewayed'):
            return (True, m['path'])
    return (False, None)

def cas_service(request):
    gatewayed, sendback = gateway_request(request)
    if sendback is None:
        sendback = 'application'
    ticket = request.GET.get('ticket', None)

    if not ticket:
        logger.info("No Ticket received in GET string")
        messages.add_message(request, {'login_check': True})
        return redirect(sendback)

    # Authenticate request with CAS
    try:
        user = get_cas_client(request).validate_ticket(ticket)
    except InvalidTicket:
        messages.add_message(request, {'login_check': True})
        return redirect(sendback)

    logger.debug(user + " successfully authenticated against CAS")

    # Authorize request with Groupy OAuth
    try:
        token, expires = oauth_client.generate_access_token(user)
        logger.debug("TOKEN: " + token)
        expires = int((expires - datetime.utcfromtimestamp(0)).total_seconds())
        messages.add_message(request, {'login_check': True,
                                       'access_token': {'value': token,
                                                        'expires': expires}})
        return redirect(sendback)
    except Unauthorized:
        if gatewayed:
            messages.add_message(request, {'login_check': True})
            return redirect(sendback)
        else:
            return redirect('forbidden')

    return redirect(sendback)

def forbidden(request):
    """
    View used when someone tries to log in and is an authenticated iPlant
    user, but was found to be unauthorized to use Atmosphere by OAuth.
    Returns HTTP status code 403 Forbidden
    """
    return render(request, 'no_user.html', status=403)
