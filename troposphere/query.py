from django.db.models import Q
from django.utils import timezone


def only_current_tokens(now_time=None):
    """
    Filters out inactive tokens.

    Pulled from core/query.py within Atmopshere
    """
    if not now_time:
        now_time = timezone.now()
    return (Q(expireTime__isnull=True) |
            Q(expireTime__gt=now_time)) & \
        Q(issuedTime__lt=now_time)
