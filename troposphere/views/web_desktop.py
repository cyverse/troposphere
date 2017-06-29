import logging
import requests

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect

from rest_framework import status

from troposphere.views.exceptions import failure_response

logger = logging.getLogger(__name__)


def guacamole(request):
    """
    Signs a redirect to transparent proxy for web desktop view.
    """

    if request.user.is_authenticated():
        # logger.debug("user %s is authenticated, well done." % request.user)
        if 'instanceId' in request.POST:
            instance_id = request.POST['instanceId']
            protocol = request.POST['protocol']
            auth_token = request.session.get('access_token')
            access_token_route = settings.API_V2_ROOT+"/web_tokens/%s?client=guacamole&protocol=%s" % (instance_id, protocol)
            headers = {
                'Authorization': "Token %s" % auth_token,
                'Accept': 'application/json',
            }
            # FIXME: Remove verify=False in the future
            response = requests.get(access_token_route, headers=headers, verify=False)
            # Raise exceptions for HTTP errors
            response.raise_for_status()
            data = response.json()
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

    if request.user.is_authenticated():
        # logger.debug("user %s is authenticated, well done." % request.user)
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
            # Raise exceptions for HTTP errors
            response.raise_for_status()
            data = response.json()
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
