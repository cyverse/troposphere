import json
import logging
import requests
import time

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseRedirect
from django.http.request import UnreadablePostError
from django.shortcuts import render, redirect, render_to_response

from itsdangerous import Signer, URLSafeTimedSerializer
from rest_framework import status
from troposphere.views.exceptions import failure_response

logger = logging.getLogger(__name__)

def _should_redirect():
    return settings.WEB_DESKTOP['redirect']['ENABLED']


def web_desktop(request):
    """
    Signs a redirect to transparent proxy for web desktop view.
    """
    template_params = {}

    if request.user.is_authenticated():
        # logger.debug("user %s is authenticated, well done." % request.user)
        sig = None
        if 'instanceId' in request.POST:
            instance_id = request.POST['instanceId']
            auth_token = request.session.get('access_token')
            access_token_route = settings.API_V2_ROOT+"/web_tokens/%s" % instance_id
            headers = {
                'Authorization': "Token %s" % auth_token,
                'Accept': 'application/json',
            }
            #FIXME: Remove verify=False in the future
            response = requests.get(access_token_route, headers=headers, verify=False)
            data = response.json()
            web_access_token = data.get('token')
            proxy_password = 'display'
            url = '%s?token=%s&password=%s' % (
                settings.WEB_DESKTOP['redirect']['PROXY_URL'],
                web_access_token, proxy_password)

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
