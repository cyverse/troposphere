import json
import logging
import time

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseRedirect
from django.http.request import UnreadablePostError
from django.shortcuts import render, redirect, render_to_response
from django.template import RequestContext

from itsdangerous import Signer, URLSafeTimedSerializer

logger = logging.getLogger(__name__)

SIGNED_SERIALIZER = URLSafeTimedSerializer(
    settings.WEB_DESKTOP['signing']['SECRET_KEY'],
    salt=settings.WEB_DESKTOP['signing']['SALT'])

SIGNER = Signer(
    settings.WEB_DESKTOP['fingerprint']['SECRET_KEY'],
    salt=settings.WEB_DESKTOP['fingerprint']['SALT'])

CONFIG_VALUES = [
    settings.WEB_DESKTOP['redirect']['COOKIE_DOMAIN'],
    settings.WEB_DESKTOP['signing']['SECRET_KEY'],
    settings.WEB_DESKTOP['signing']['SALT'],
    settings.WEB_DESKTOP['fingerprint']['SECRET_KEY'],
    settings.WEB_DESKTOP['fingerprint']['SALT']
]


def _should_redirect():
    return settings.WEB_DESKTOP['redirect']['ENABLED']

def web_desktop(request):

    template_params = {}

    logger.info("POST body: %s" % request.POST)

    if request.user.is_authenticated():
        logger.info("user is authenticated, well done.")
        sig = None

        if 'ipAddress' in request.POST:
            ip_address = request.POST['ipAddress']
            client_ip = request.META['REMOTE_ADDR']

            logger.info("ip_address: %s" % ip_address)
            logger.info("client_ip: %s" % client_ip)

            client_ip_fingerprint = SIGNER.get_signature(client_ip)
            browser_fingerprint = SIGNER.get_signature(''.join([
                request.META['HTTP_USER_AGENT'],
                request.META['HTTP_ACCEPT'],
                request.META['HTTP_ACCEPT_ENCODING'],
                request.META['HTTP_ACCEPT_LANGUAGE']]))

            sig = SIGNED_SERIALIZER.dumps([ip_address,
                client_ip_fingerprint,
                browser_fingerprint])

            url = '%s?sig=%s' % (
                settings.WEB_DESKTOP['redirect']['PROXY_URL'],
                sig)

            response = HttpResponseRedirect(url)
            response.set_cookie('original_referer', request.META['HTTP_REFERER'],
                domain=settings.WEB_DESKTOP['redirect']['COOKIE_DOMAIN'])

            logger.info("redirect response: %s" % (response))

            return response
        else:
            raise UnreadablePostError

    else:
        logger.info("not authenticated: \nrequest:\n %s" % request)
        raise PermissionDenied




    return response
