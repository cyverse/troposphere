import logging
import json
from uuid import uuid4

from django.conf import settings
from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt

from caslib import OAuthClient as CAS_OAuthClient

from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login

from rest_framework import status

from django_cyverse_auth.authBackends import get_or_create_user, get_or_create_token
from django_cyverse_auth.views import globus_login_redirect, globus_logout_redirect
from troposphere.views.exceptions import invalid_auth

logger = logging.getLogger(__name__)
cas_oauth_client = CAS_OAuthClient(settings.CAS_SERVER,
                                   settings.OAUTH_CLIENT_CALLBACK,
                                   settings.OAUTH_CLIENT_KEY,
                                   settings.OAUTH_CLIENT_SECRET,
                                   auth_prefix=settings.CAS_AUTH_PREFIX)


def _mock_login(request):
    user = authenticate(username=None, request=request)
    auth_login(request, user)
    auth_token = user.auth_tokens.last()
    if not auth_token:
        user_profile = get_or_create_user(user.username, _get_user_profile(user))
        auth_token = get_or_create_token(user_profile, issuer="MockLoginBackend")
    _apply_token_to_session(request, auth_token.key)

    if request.session.get('redirect_to'):
        logger.debug("Found `redirect_to` in session... ")
        logger.debug("Redirecting to: %s" %
            (request.session.get('redirect_to'),))

        redirect_url = request.session.pop('redirect_to')
        return redirect(redirect_url)
    elif 'redirect_to' in request.GET:
        logger.debug("Found `redirect_to` in GET params... ")
        logger.debug("Redirecting to: %s" %
            (request.GET.get('redirect_to'),))

        redirect_url = request.GET.get('redirect_to')
        return redirect(redirect_url)
    return redirect('application')

def _get_user_profile(user):
    user_profile = {"username": user.username, "firstName": user.first_name, "lastName": user.last_name, "email": user.email}
    return user_profile

def _post_login(request):
    if len(request.POST) == 0:
        data = json.loads(request.body)
    else:
        data = request.POST

    auth_kwargs = {'username': data.get('username'), 'password': data.get('password'), 'request':request}
    if 'token' in data:
        auth_kwargs['token'] = data['token']
    if 'auth_url' in data:
        auth_kwargs['auth_url'] = data['auth_url']
    if 'project_name' in data:
        auth_kwargs['project_name'] = data['project_name']
    user = authenticate(**auth_kwargs)
    # A traditional POST login will likely NOT create a 'Token', so lets do that now.
    if not user:
            return invalid_auth("Username/Password combination was invalid")
    auth_login(request, user)
    issuer_backend = request.session.get('_auth_user_backend', '').split('.')[-1]
    user_profile = get_or_create_user(user.username, _get_user_profile(user))
    token_key = request.session.pop('token_key', None)
    new_token = get_or_create_token(user_profile, token_key=token_key)
    _apply_token_to_session(request, new_token.key)
    request.session['access_token'] = new_token.key
    request.session['username'] = user.username
    to_json = json.dumps({"username":user.username, "token":new_token.key})
    return HttpResponse(to_json, content_type="application/json")


def _apply_token_to_session(request, token):
    request.session['access_token'] = token


@csrf_exempt
def login(request):
    all_backends = settings.AUTHENTICATION_BACKENDS
    # pro-active session cleaning
    request.session.clear_expired()
    if request.META['REQUEST_METHOD'] == 'POST':
        return _post_login(request)
    elif "django_cyverse_auth.authBackends.MockLoginBackend" in all_backends:
        return _mock_login(request)
    elif 'django_cyverse_auth.authBackends.GlobusOAuthLoginBackend' in all_backends:
        return _globus_login(request)
    elif 'django_cyverse_auth.authBackends.OAuthLoginBackend' in all_backends:
        return _oauth_login(request)
    #Uh - Oh.
    return redirect('application')


def logout(request):
    """
    Given the configured `AUTHENTICATION_BACKENDS`, perform a _logout_
    request for that backend if the `force=true` query string argument
    is present on the request.

    See `troposphere/settings/default.py` for the configured backends.
    """
    all_backends = settings.AUTHENTICATION_BACKENDS
    # Django >1.8: the session cookie will be deleted on `.flush()`
    request.session.flush()
    request.session.clear_expired()

    #Look for 'cas' to be passed on logout.
    request_data = request.GET
    if request_data.get('force', False):
        if 'django_cyverse_auth.authBackends.CASLoginBackend' in all_backends\
        or 'django_cyverse_auth.authBackends.OAuthLoginBackend' in all_backends:
            redirect_to = request_data.get("service")
            if not redirect_to:
                redirect_to = settings.SERVER_URL + reverse('application')
            logout_url = cas_oauth_client.logout(redirect_to)
            logger.info("[CAS] Redirect user to: %s" % logout_url)
            return redirect(logout_url)
        elif 'django_cyverse_auth.authBackends.GlobusLoginBackend' in all_backends\
          or 'django_cyverse_auth.authBackends.GlobusOAuthLoginBackend' in all_backends:
            logger.info("[Globus] Redirect user to logout")
            return globus_logout_redirect(request)
    return redirect('application')


#Initiate the OAuth login (Authorize)
def _globus_login(request):
    """
    NOTE: we use 'next' not 'redirect' here
    """
    return globus_login_redirect(request)


def set_redirect_in_session(request):
    redirect_url = request.GET.get('redirect_to')
    referer_url = request.META.get('HTTP_REFERER')
    # If the referer is 'application/images' the *login* button should
    # really take you to the Authenticated 'home' page, *dashboard*
    if referer_url and referer_url.endswith('/application/images'):
        redirect_url = '/application/dashboard'
    # Set the redirect url to match the query-param `?redirect_to=`
    if redirect_url:
        request.session['redirect_to'] = redirect_url
    return

def _oauth_login(request):
    set_redirect_in_session(request)

    response = redirect(cas_oauth_client.authorize_url())

    return response


# CAS OAuth callback ( After the Authorize is OK)
def cas_oauth_service(request):
    if 'code' not in request.GET:
        #You should not be here, you should be at OAuth-wrapped CAS login.
        return redirect(cas_oauth_client.authorize_url())

    code_service_ticket = request.GET['code']

    try:
        access_token, expiry_date = cas_oauth_client.get_access_token(code_service_ticket)
    except Exception as cas_failure:
        # TODO: Create a template page that will include a 'banner' similar to /application
        # We need to be able to render-response here and terminate the authentication cycle/500 errors
        pass

    if hasattr(settings, "CAS_DEV_TOKEN"):
        access_token = settings.CAS_DEV_TOKEN

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

    response = redirect('application')

    return response
