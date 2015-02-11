import logging

from django.conf import settings

from caslib import OAuthClient as CAS_OAuthClient

from api.models import UserToken
from django.contrib.auth.models import User


logger = logging.getLogger(__name__)
cas_oauth_client = CAS_OAuthClient(settings.CAS_SERVER,
                                   settings.OAUTH_CLIENT_CALLBACK,
                                   settings.OAUTH_CLIENT_KEY,
                                   settings.OAUTH_CLIENT_SECRET,
                                   auth_prefix=settings.CAS_AUTH_PREFIX)


class OAuthLoginBackend(object):
    """
    CAS OAuth Authentication Backend

    Exchanges an access_token for a user, creates it does not exist
    """

    def authenticate(self, access_token=None):
        access_token = "TGT-296-Kr4WCd4pcGtdBpbjfTjDzyF6IFaiqlkCbF2t2NyJ4LexjdquEE-auth.iplantc.org"

        try:
            user_token = UserToken.objects.get(token=access_token)

        except UserToken.DoesNotExist:
            profile = cas_oauth_client.get_profile(access_token=access_token)

            profile_dict = dict()
            profile_dict['username'] = profile['id']
            for attr in profile['attributes']:
                key = attr.keys()[0]
                value = attr[key]
                profile_dict[key] = value

            try:
                user = User.objects.get(username=profile_dict['username'])
            except User.DoesNotExist:
                user = User.objects.create(
                    username=profile['username'],
                    first_name=profile_dict['firstName'],
                    last_name=profile_dict['lastName'],
                    email=profile_dict['email'],
                    is_staff=('staff' in profile_dict['entitlement'])
                )

            user_token = UserToken.objects.create(token=access_token, user=user)

        user = user_token.user
        return user

    def get_user(self, username):
        """
        Get a User object from the username.
        """
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None