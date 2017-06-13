
import logging

from django.conf import settings
from django.shortcuts import render, redirect, render_to_response

logger = logging.getLogger(__name__)


def allocations(request):
    """
    View that is shown if a community member has XSEDE/Globus access,
    but is missing allocation-sources (no way to charge activity).
    """
    # populate with values `site_metadata` in the future
    template_params = {}

    template_params['ORG_NAME'] = settings.ORG_NAME

    if hasattr(settings, "BASE_URL"):
        template_params['BASE_URL'] = settings.BASE_URL

    response = render_to_response(
        'allocations.html',
        template_params,
    )

    return response
