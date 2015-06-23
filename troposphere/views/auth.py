import logging
from uuid import uuid4

from django.conf import settings
from django.core.urlresolvers import reverse
from django.shortcuts import redirect

from caslib import OAuthClient as CAS_OAuthClient

from api.models import UserToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login

from troposphere.auth_backends import get_or_create_user, generate_token

logger = logging.getLogger(__name__)
cas_oauth_client = CAS_OAuthClient(settings.CAS_SERVER,
                                   settings.OAUTH_CLIENT_CALLBACK,
                                   settings.OAUTH_CLIENT_KEY,
                                   settings.OAUTH_CLIENT_SECRET,
                                   auth_prefix=settings.CAS_AUTH_PREFIX)

def _mock_login(request):
    user = authenticate(username=None, request=request)
    auth_login(request, user)
    last_token = user.usertoken_set.last()
    if not last_token:
        last_token = generate_token(user)
    _apply_token_to_session(request, last_token.token)

    if request.session.get('redirect_to'):
        redirect_url = request.session.pop('redirect_to')
        return redirect(redirect_url)
    return redirect('application')


def _post_login(request):
    user = authenticate(username=request.POST.get('username'), password=request.POST.get('password'))
    # A traditional POST login will likely NOT create a 'UserToken', so lets do that now.
    if user:
        new_token = generate_token(user)
        _apply_token_to_session(request, new_token.token)
    auth_login(request, user)


def _apply_token_to_session(request, token):
    request.session['access_token'] = token


def login(request):
    all_backends = settings.AUTHENTICATION_BACKENDS
    if "troposphere.auth_backends.MockLoginBackend" in all_backends:
        return _mock_login(request)
    #TODO: The logic here might be preventing a 'normal POST login' from getting in when OAuth is
    #      an available auth_backend
    elif 'troposphere.auth_backends.OAuthLoginBackend' in all_backends:
        return _oauth_login(request)
    elif request.META['REQUEST_METHOD'] is 'POST':
        return _post_login(request)
    #Uh - Oh.
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

#Initiate the OAuth login (Authorize)
def _oauth_login(request):
    redirect_url = request.GET.get('redirect')
    if redirect_url:
        request.session['redirect_to'] = redirect_url
    return redirect(cas_oauth_client.authorize_url())


# CAS OAuth callback ( After the Authorize is OK)
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
    _apply_token_to_session(request, access_token)

    if request.session.get('redirect_to'):
        redirect_url = request.session.pop('redirect_to')
        return redirect(redirect_url)

    return redirect('application')
