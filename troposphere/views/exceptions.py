import json
import logging

from rest_framework import status

logger = logging.getLogger(__name__)

from django.http import HttpResponse

def invalid_auth(message):
    return failure_response(
        status.HTTP_400_BAD_REQUEST,
        "Authentication request refused -- %s" % message)


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

