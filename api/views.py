from rest_framework import (viewsets, mixins, status)
import requests
import jwt
import json
from troposphere import settings
from Crypto.Hash import SHA256
from rest_framework.response import Response
from django.contrib.auth.models import User
from api.models import UserPreferences
from .serializers import UserSerializer, UserPreferenceSerializer

from troposphere.version import get_version


class VersionViewSet(mixins.ListModelMixin,
                     viewsets.GenericViewSet):
    permission_classes = ()

    def list(self, request, *args, **kwargs):
        """
        This request will retrieve Atmosphere's version,
        including the latest update to the code base and the date the
        update was written.
        """
        return Response(get_version())


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_fields = ('email',)
    http_method_names = ['get', 'head', 'options', 'trace']

    def get_queryset(self):
        """
        Filter users to return only current user
        """
        user = self.request.user
        return User.objects.filter(username=user.username)


class UserPreferenceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed.
    """
    queryset = UserPreferences.objects.all()
    serializer_class = UserPreferenceSerializer
    http_method_names = ['get', 'put', 'patch', 'head', 'options', 'trace']

    def get_queryset(self):
        """
        Filter users to return only current user
        """
        user = self.request.user
        return UserPreferences.objects.filter(user=user)


class BadgeViewSet(viewsets.GenericViewSet):
    queryset = UserPreferences.objects.none()
    serializer_class = UserPreferenceSerializer
    http_method_names = ['get', 'post', 'head', 'options', 'trace']

    def create(self, request, *args, **kwargs):
        url = settings.BADGE_API_HOST
        email_address = str(User.objects.get(username=self.request.user).email)
        slug = settings.BADGE_SYSTEM_SLUG
        secret = settings.BADGE_SECRET
        badge = str(self.request.data['badgeSlug'])
        path = '/systems/' + slug + '/badges/' + badge + '/instances'
        header = {"typ": "JWT", "alg": 'HS256'}
        body = json.dumps({"email": email_address})

        computed_hash = SHA256.new()
        computed_hash.update(body)

        payload = {'key': "master", 'method': "POST", 'path': path, "body": {"alg": "sha256", "hash": computed_hash.hexdigest()}}
        token = jwt.encode(payload, secret, headers=header)

        options = {
            'method': 'POST',
            'url': url + path,
            'headers': {
                'Authorization': 'JWT token="' + token + '"',
                'Content-Type': 'application/json'
            }
        }
        r = requests.post(url + path, data=body, headers=options['headers'], verify=False)
        return Response(data=r.json(), status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        url = settings.BADGE_API_HOST
        email = User.objects.get(username=self.request.user).email
        slug = settings.BADGE_SYSTEM_SLUG
        name = settings.BADGE_SYSTEM_NAME
        secret = settings.BADGE_SECRET

        path = '/systems/' + slug + '/instances/' + email
        header = {"typ": "JWT", "alg": 'HS256'}
        body = str({"slug": slug, "name": name, "url": url + path})

        computed_hash = SHA256.new()
        computed_hash.update(body)

        payload = {'key': "master", 'method': "GET", 'path': path, "body": {"alg": "sha256", "hash": computed_hash.hexdigest()}}
        token = jwt.encode(payload, secret, headers=header)

        options = {
            'method': 'GET',
            'url': url + path,
            'headers': {
                'Authorization': 'JWT token="' + token + '"',
                'Content-Type': 'application/json'
            }
        }

        r = requests.get(url + path, headers=options['headers'], verify=False)
        return Response(data=r.json(), status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        url = settings.BADGE_API_HOST
        slug = settings.BADGE_SYSTEM_SLUG
        name = settings.BADGE_SYSTEM_NAME
        secret = settings.BADGE_SECRET

        path = '/systems/' + slug + '/badges'
        header = {"typ": "JWT", "alg": 'HS256'}
        body = str({"slug": slug, "name": name, "url": url + path})

        computed_hash = SHA256.new()
        computed_hash.update(body)

        payload = {'key': "master", 'method': "GET", 'path': path, "body": {"alg": "sha256", "hash": computed_hash.hexdigest()}}
        token = jwt.encode(payload, secret, headers=header)

        options = {
            'method': 'GET',
            'url': url + path,
            'headers': {
                'Authorization': 'JWT token="' + token + '"',
                'Content-Type': 'application/json'
            }
        }

        r = requests.get(url + path, headers=options['headers'], verify=False)
        return Response(data=r.json(), status=status.HTTP_200_OK)
