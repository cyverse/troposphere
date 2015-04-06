import logging

from django.conf import settings
from django.core.urlresolvers import reverse
from django.shortcuts import redirect

from caslib import OAuthClient as CAS_OAuthClient

from api.models import UserToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login


logger = logging.getLogger(__name__)
cas_oauth_client = CAS_OAuthClient(settings.CAS_SERVER,
                                   settings.OAUTH_CLIENT_CALLBACK,
                                   settings.OAUTH_CLIENT_KEY,
                                   settings.OAUTH_CLIENT_SECRET,
                                   auth_prefix=settings.CAS_AUTH_PREFIX)


def login(request):
    import ipdb;ipdb.set_trace()
    all_backends = settings.AUTHENTICATION_BACKENDS
    if "troposphere.auth_backends.MockLoginBackend" in all_backends:
        user = authenticate(username=None, password=None, request=request)
        auth_login(request, user)
    elif 'troposphere.auth_backends.OAuthLoginBackend' in all_backends:
        redirect_url = request.GET.get('redirect')
        if redirect_url:
            request.session['redirect_to'] = redirect_url
        return redirect(cas_oauth_client.authorize_url())
    else:
        user = authenticate(request=request)
        auth_login(request, user)
    return redirect('application')


def logout(request):
    request.session.flush()
    #Look for 'cas' to be passed on logout.
    request_data = request.GET
    if request_data.get('cas', False):
        redirect_to = request_data.get("service")
        if not redirect_to:
            redirect_to = settings.SERVER_URL + reverse('application')
        logout_url = cas_oauth_client.logout(redirect_to)
        logger.info("Redirect user to: %s" % logout_url)
        return redirect(logout_url)
    return redirect('application')


# CAS OAuth callback
def cas_oauth_service(request):
    if 'code' not in request.GET:
        #You should not be here, you should be at OAuth-wrapped CAS login.
        return redirect(cas_oauth_client.authorize_url())

    code_service_ticket = request.GET['code']
    access_token, expiry_date = cas_oauth_client.get_access_token(code_service_ticket)

    if not access_token:
        #code_service_ticket has expired (They don't last very long...)
        #Lets try again (Redirect to OAuth-wrapped CAS login)
        return redirect(cas_oauth_client.authorize_url())

    user = authenticate(access_token=access_token)
    auth_login(request, user)

    request.session['access_token'] = access_token

    if request.session.get('redirect_to'):
        redirect_url = request.session.pop('redirect_to')
        return redirect(redirect_url)

    return redirect('application')
