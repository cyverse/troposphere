import logging
import os

import requests

from django.conf import settings
from django.shortcuts import redirect

from caslib import OAuthClient as CAS_OAuthClient


logger = logging.getLogger(__name__)
cas_oauth_client = CAS_OAuthClient(settings.CAS_SERVER,
                                   settings.OAUTH_CLIENT_CALLBACK,
                                   settings.OAUTH_CLIENT_KEY,
                                   settings.OAUTH_CLIENT_SECRET,
                                   auth_prefix=settings.CAS_AUTH_PREFIX)

def is_emulated_session(request):
    """
    Indicates if the session being handled is someone _emulating_
    another user/identity within the system.
    """
    return 'emulator_token' in request.session


def emulate(request, username):
    if 'access_token' not in request.session:
        return redirect(cas_oauth_client.authorize_url())

    if 'emulator_token' in request.session:
        old_token = request.session['emulator_token']
    else:
        old_token = request.session['access_token']

    logger.info("[EMULATE]Session_token: %s. Request to emulate %s."
                % (old_token, username))
    r = requests.get(
        os.path.join(settings.SERVER_URL,
                     "api/v1/token_emulate/%s" % username),
        verify=False,
        headers={'Authorization': 'Token %s' % old_token, 'Accept': 'application/json', 'Content-Type': 'application/json'})
    try:
        j_data = r.json()
    except ValueError:
        logger.warn("[EMULATE]The API server returned non-json data(Error) %s" % r.text)
        return redirect('application')

    # Check if error response was sent
    if r.status_code < 200 or  r.status_code > 299:
        logger.warn("[EMULATE] failed with status_code=%s and message=(%s)",
                    r.status_code, j_data)
        return redirect("application")

    new_token = j_data.get('token')
    emulated_by = j_data.get('emulated_by')
    if not new_token or not emulated_by:
        logger.warn("[EMULATE]The API server returned data missing the key(s) "
                    "token/emulated_by. Data: %s" % j_data)
        return redirect('application')

    logger.info("[EMULATE]User %s (Token: %s) has emulated User %s (Token:%s)"
                % (emulated_by, old_token, username, new_token))

    request.session["emulate_by"] = emulated_by
    request.session['emulator_token'] = old_token
    request.session['access_token'] = new_token
    return redirect('application')


def unemulate(request):
    if 'emulator_token' in request.session:
        old_token = request.session['emulator_token']
        del request.session['emulator_token']
    else:
        old_token = request.session['access_token']

    # Restore the 'old token'
    logger.info("[EMULATE]Session_token: %s. Request to remove emulation."
                % (old_token, ))
    request.session['access_token'] = old_token

    if "emulate_by" in request.session:
        del request.session['emulate_by']

    return redirect('application')
