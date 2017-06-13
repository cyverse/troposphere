import json
import logging
import time

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import render, redirect, render_to_response
from troposphere.models import TroposphereUser

logger = logging.getLogger(__name__)


def _create_signature(secret, *parts):
    import hmac, hashlib
    hash = hmac.new(secret, digestmod=hashlib.sha1)
    for part in parts:
        hash.update(str(part))
    return hash.hexdigest()


def web_shell(request):
    response = HttpResponse()
    shell_user = request.user
    if request.session:
        logger.info("request.session: %s" % request.session.items())
        atmo_username = request.session.get('username','')
        atmo_user = TroposphereUser.objects.filter(username=atmo_username).first()
        if atmo_user:
            shell_user = atmo_user

    logger.info("request.user = %s" % request.user)
    logger.info("User for shell = %s" % shell_user)
    logger.info("is_auth? %s" % request.user.is_authenticated())

    if request.user.is_authenticated():
        logger.info("rendering web_shell template... ")

        secret = settings.GATE_ONE_API_SECRET
        authobj = {
            'api_key': settings.GATE_ONE_API_KEY,
            'upn': shell_user.username,
            'timestamp': str(int(time.time() * 1000)),
        }

        sig = _create_signature(secret, authobj['api_key'],
                authobj['upn'], authobj['timestamp'])

        # GATE_ONE_API_AUTH_SETTINGS
        template_params = {
            'WEB_SH_BASE_URL' : settings.WEB_SH_BASE_URL,
            'WEB_SH_JS_FILE': 'static/gateone.js',
            'GATE_ONE_API_KEY': authobj['api_key'],
            'USERNAME': authobj['upn'],
            'GEN_TIMESTAMP': authobj['timestamp'],
            'GATE_ONE_SIGNATURE': sig,
            'SIGNATURE_METHOD': 'HMAC-SHA1',
            'GATE_ONE_API_VERSION': '1.0'
        }

        if "location" in request.GET:
            template_params['gate_one_location'] = request.GET['location']

        response = render_to_response(
                'web_shell.html',
                template_params,
        )
    else:
        logger.info("not authenticated: \nrequest:\n %s" % request)
        raise PermissionDenied

    return response

