import logging

from troposphere.query import only_current_tokens


logger = logging.getLogger(__name__)


def has_valid_token(user):
    """
    Returns boolean indicating if there are non-expired authentication
    tokens associated with the user.
    """
    logger.info("user has auth_tokens attributes? %s" %
        (hasattr(user, "auth_tokens")))

    return user.auth_tokens.filter(only_current_tokens()).exists()


def get_current_tokens(user):
    """
    Returns the non-expired authentication tokens.
    """
    logger.info("user has auth_tokens attributes? %s" %
        (hasattr(user, "auth_tokens")))

    return user.auth_tokens.filter(only_current_tokens())
