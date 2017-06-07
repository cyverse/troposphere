import json
import logging
import time
import requests

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseRedirect
from django.http.request import UnreadablePostError
from django.shortcuts import render, redirect, render_to_response
from django.template import RequestContext

from itsdangerous import Signer, URLSafeTimedSerializer

from rest_framework import status

logger = logging.getLogger(__name__)

SIGNED_SERIALIZER = URLSafeTimedSerializer(
    settings.WEB_DESKTOP['signing']['SECRET_KEY'],
    salt=settings.WEB_DESKTOP['signing']['SALT'])

SIGNER = Signer(
    settings.WEB_DESKTOP['fingerprint']['SECRET_KEY'],
    salt=settings.WEB_DESKTOP['fingerprint']['SALT'])


def _should_redirect():
    return settings.WEB_DESKTOP['redirect']['ENABLED']


def guacamole(request):
    """
    Signs a redirect to transparent proxy for web desktop view.
    """
    template_params = {}

    if request.user.is_authenticated():
        # logger.debug("user %s is authenticated, well done." % request.user)
        sig = None
        if 'instanceId' in request.POST:
            instance_id = request.POST['instanceId']
            protocol = request.POST['protocol']
            auth_token = request.session.get('access_token')
            access_token_route = settings.API_V2_ROOT+"/web_tokens/%s?client=guacamole&protocol=%s" % (instance_id, protocol)
            headers = {
                'Authorization': "Token %s" % auth_token,
                'Accept': 'application/json',
            }
            #FIXME: Remove verify=False in the future
            response = requests.get(access_token_route, headers=headers, verify=False)
            data = response.json()
            web_access_token = data.get('token')
            url = data.get('token_url')
            response = HttpResponseRedirect(url)
            response.set_cookie('original_referer', request.META['HTTP_REFERER'],
                domain=settings.WEB_DESKTOP['redirect']['COOKIE_DOMAIN'])

            logger.info("redirect response: %s" % (response))
            return response
        else:
            logger.info("Failed request - POST body: %s" % request.POST)
            return failure_response(
                status.HTTP_400_BAD_REQUEST,
                "POST does not contain the required data")

    else:
        logger.info("not authenticated: \nrequest:\n %s" % request)
        raise PermissionDenied


def web_desktop(request):
    """
    Signs a redirect to transparent proxy for web desktop view.
    """
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
                request.META['HTTP_ACCEPT_LANGUAGE']]))

            sig = SIGNED_SERIALIZER.dumps([ip_address,
                client_ip_fingerprint,
                browser_fingerprint])

            url = '%s?token=%s&password=display' % (
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

def failure_response(status, message):
    """
    Return a djangorestframework Response object given an error
    status and message.
    """
    logger.info("status: %s message: %s" % (status, message))
    json_obj = {"errors":
            [{'code': status, 'message': message}]
        }
    to_json = json.dumps(json_obj)
    return HttpResponse(to_json,
                    status=status,
                    content_type='application/json')
