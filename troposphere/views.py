import logging
from datetime import datetime

from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.urlresolvers import reverse

from caslib import CASClient
from troposphere.oauth import OAuthClient, Unauthorized
from troposphere.ldap_client import LDAPClient
import troposphere.messages as messages

logger = logging.getLogger(__name__)

def get_cas_client(request):
    #Simple service validation setup
    service_url = ""
    if request:
        service_url = request.build_absolute_uri(reverse('cas_service'))
    return CASClient(settings.CAS_SERVER, service_url)

key = open(settings.OAUTH_PRIVATE_KEY_PATH, 'r').read()
oauth_client = OAuthClient(settings.OAUTH_SERVER,
                           key,
                           settings.OAUTH_ISS,
                           settings.OAUTH_SCOPE)

ldap_client = LDAPClient(settings.LDAP_SERVER, settings.LDAP_SERVER_DN)

def root(request):
    return redirect('application')

def application(request):
    logger.debug("Application URL requested")
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
                response = render(request, 'index.html')

    if response:
        return response

    flash = {'gatewayed': True, 'path': request.get_full_path()}
    messages.add_message(request, flash)
    return redirect(get_cas_client(request)._login_url(gateway=True))

def get_maintenance():
    """
    Returns a list of maintenance records along with a boolean to indicate
    whether or not login should be disabled
    """
    return ([], False)

def maintenance(request):
    return HttpResponse("We're undergoing maintenance", status=503)

def login(request):
    if 'token' in request.GET:
        raise Exception("I Really want to use this token!")
        #TODO: USE IT.
    #Go get one.
    return redirect(get_cas_client(request)._login_url())

def logout(request):
    root_url = request.build_absolute_uri(reverse('application'))
    return redirect(get_cas_client(request)._logout_url(root_url))

def gateway_request(request):
    """
    Returns a tuple of the form (a, b, c) where a is true iff the preceeding
    request was an attempt to log in the use into CAS with gateway=true, b
    is the path that was originally requested on Troposphere, and c is the
    name of the user to emulate if the user is allowed to do so
    https://wiki.jasig.org/display/CAS/gateway
    """
    for m in messages.get_messages(request):
        if isinstance(m, dict) and m.has_key('gatewayed'):
            if m.has_key('emulated_user'):
                return (True, m['path'], m['emulated_user'])
            else:
                return (True, m['path'], None)
    return (False, None, None)


def cas_service(request):
    logger.debug("Cas service request")
    gatewayed, sendback, emulated_user = gateway_request(request)
    if sendback is None:
        sendback = 'application'
    ticket = request.GET.get('ticket', None)

    if not ticket:
        logger.info("No Ticket received in GET string")
        messages.add_message(request, {'login_check': True})
        return redirect(sendback)

    # Authenticate request with CAS
    cas_response = get_cas_client(request).cas_serviceValidate(ticket)
    if not cas_response or not cas_response.user:
        messages.add_message(request, {'login_check': True})
        return redirect(sendback)
    user = cas_response.user
    logger.debug(user + " successfully authenticated against CAS")

    # Authorize request with Groupy OAuth
    try:
        token_user = user
        if emulated_user:
            if not user_can_emulate(user):
                raise Unauthorized("User %s is not authorized to "
                                   "emulate user %s" % (user, emulated_user))
            token_user = emulated_user

        token, expires = oauth_client.generate_access_token(token_user)
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

def user_can_emulate(username):
    """
    Returns true iff the provider user is allowed to emulate
    """
    core_services = ldap_client.get_group_members('core-services')
    return username in core_services

def emulate(request, username=None):
    """
    Allow authorized users to pretend to be another user
    """
    application_url = request.build_absolute_uri(reverse('application'))

    flash = {
        'gatewayed': True,
        'path': application_url,
        'emulated_user': username
    }
    messages.add_message(request, flash)
    return redirect(get_cas_client(request)._login_url(gateway=True))
