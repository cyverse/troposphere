import logging
import requests

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect

from rest_framework import status

from troposphere.views.exceptions import failure_response

logger = logging.getLogger(__name__)


def web_desktop(request):
    """
    Signs a redirect to transparent proxy for web desktop view.
    """
    if not request.user.is_authenticated():
        raise PermissionDenied

    # Check that all query params are present
    requiredFields = ['client', 'instance_id', 'protocol']
    if not all(field in request.POST for field in requiredFields):
        return failure_response(
                status.HTTP_400_BAD_REQUEST,
                "POST does not contain the required data")

    auth_token = request.session.get('access_token')

    access_token_route = \
        "{api_root}/web_tokens/{instance_id}?client={client}&protocol={protocol}" \
        .format(
            api_root=settings.API_V2_ROOT,
            client=request.POST['client'],
            protocol=request.POST['protocol'],
            instance_id=request.POST['instance_id']
        )

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
    response.set_cookie('original_referer', request.META['HTTP_REFERER'])

    return response
