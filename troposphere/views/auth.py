import logging
from uuid import uuid4

from django.conf import settings
from django.core.urlresolvers import reverse
from django.shortcuts import redirect

from caslib import OAuthClient as CAS_OAuthClient

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login

from django_cyverse_auth.authBackends import get_or_create_user, generate_token
from django_cyverse_auth.views import globus_login_redirect, globus_logout_redirect

logger = logging.getLogger(__name__)
cas_oauth_client = CAS_OAuthClient(settings.CAS_SERVER,
                                   settings.OAUTH_CLIENT_CALLBACK,
                                   settings.OAUTH_CLIENT_KEY,
                                   settings.OAUTH_CLIENT_SECRET,
                                   auth_prefix=settings.CAS_AUTH_PREFIX)


def _mock_login(request):
    user = authenticate(username=None, request=request)
    auth_login(request, user)
    last_token = user.auth_tokens.last()
    if not last_token:
        last_token = generate_token(user)
    _apply_token_to_session(request, last_token.key)

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


def _post_login(request):
    user = authenticate(username=request.POST.get('username'),
                        password=request.POST.get('password'))
    # A traditional POST login will likely NOT create a 'Token', so lets do that now.
    if user:
        new_token = generate_token(user)
        _apply_token_to_session(request, new_token.token)
    auth_login(request, user)


def _apply_token_to_session(request, token):
    request.session['access_token'] = token


def login(request):
    all_backends = settings.AUTHENTICATION_BACKENDS
    # pro-active session cleaning
    request.session.clear_expired()

    if "django_cyverse_auth.authBackends.MockLoginBackend" in all_backends:
        return _mock_login(request)
    elif 'django_cyverse_auth.authBackends.GlobusOAuthLoginBackend' in all_backends:
        return _globus_login(request)
    elif 'django_cyverse_auth.authBackends.OAuthLoginBackend' in all_backends:
        return _oauth_login(request)
    elif request.META['REQUEST_METHOD'] is 'POST':
        return _post_login(request)
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
