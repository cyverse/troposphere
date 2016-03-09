import json

import jwt
import requests

from Crypto.Hash import SHA256
from django.contrib.auth.models import User
from rest_framework import (viewsets, mixins, status)
from rest_framework.response import Response

from api.models import UserPreferences
from troposphere import settings
from troposphere.version import get_version

from .serializers import UserSerializer, UserPreferenceSerializer


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
        system_slug = settings.BADGE_SYSTEM_SLUG
        system_name = settings.BADGE_SYSTEM_NAME
        issuer_slug = settings.BADGE_ISSUER_SLUG
        issuer_name = settings.BADGE_ISSUER_NAME
        program_slug = settings.BADGE_PROGRAM_SLUG
        program_name = settings.BADGE_PROGRAM_NAME
        secret = settings.BADGE_SECRET

        badge = str(self.request.data['badgeSlug'])

        if settings.BADGE_PROGRAM_SLUG:
            path = '/systems/' + system_slug + '/issuers/' + issuer_slug + '/programs/' + program_slug + '/badges/' + badge + '/instances'

        elif settings.BADGE_ISSUER_SLUG:
            path = '/systems/' + system_slug + '/issuers/' + issuer_slug + '/badges/' + badge + '/instances'

        else:
            path = '/systems/' + system_slug+ '/badges/' + badge + '/instances'

        header = {"typ": "JWT", "alg": 'HS256'}
        body = json.dumps({"email": email_address})

        computed_hash = SHA256.new()
        computed_hash.update(body)

        payload = {
            'key': "master",
            'method': "POST",
            'path': path,
            "body": {
                "alg": "sha256",
                "hash": computed_hash.hexdigest()
            }
        }
        token = jwt.encode(payload, secret, headers=header)

        options = {
            'method': 'POST',
            'url': url + path,
            'headers': {
                'Authorization': 'JWT token="' + token + '"',
                'Content-Type': 'application/json'
            }
        }
        r = requests.post(url + path,
                data=body,
                headers=options['headers'],
                verify=False)

        return Response(data=r.json(), status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        url = settings.BADGE_API_HOST
        email = User.objects.get(username=self.request.user).email

        system_slug = settings.BADGE_SYSTEM_SLUG
        system_name = settings.BADGE_SYSTEM_NAME
        issuer_slug = settings.BADGE_ISSUER_SLUG
        issuer_name = settings.BADGE_ISSUER_NAME
        program_slug = settings.BADGE_PROGRAM_SLUG
        program_name = settings.BADGE_PROGRAM_NAME
        secret = settings.BADGE_SECRET

        path = '/systems/' + system_slug + '/issuers/' + issuer_slug + '/programs/' + program_slug + '/instances/' + email
        header = {"typ": "JWT", "alg": 'HS256'}
        body = str({"system_slug": system_slug, "name": system_name, "url": url + path})

        computed_hash = SHA256.new()
        computed_hash.update(body)

        payload = {
            'key': "master",
            'method': "GET",
            'path': path,
            "body": {
                "alg": "sha256",
                "hash": computed_hash.hexdigest()
            }
        }
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

        if settings.BADGE_PROGRAM_SLUG:
            to_return = {'instances': []}
            for instance in data['instances']:
                if 'program' in instance['badge']:
                    to_return['instances'].append(instance)
            return Response(data=to_return, status=status.HTTP_200_OK)

        elif settings.BADGE_ISSUER_SLUG:
            to_return = {'instances': []}
            for instance in data['instances']:
                if 'issuer' in instance['badge']:
                    to_return['instances'].append(instance)
            return Response(data=to_return, status=status.HTTP_200_OK)

        else:
            return Response(data=data, status=status.HTTP_200_OK)

        r = requests.get(url + path,
                headers=options['headers'],
                verify=False)

        return Response(data=r.json(), status=status.HTTP_200_OK)


    def list(self, request, *args, **kwargs):
        url = settings.BADGE_API_HOST
        system_slug = settings.BADGE_SYSTEM_SLUG
        system_name = settings.BADGE_SYSTEM_NAME
        issuer_slug = settings.BADGE_ISSUER_SLUG
        issuer_name = settings.BADGE_ISSUER_NAME
        program_slug = settings.BADGE_PROGRAM_SLUG
        program_name = settings.BADGE_PROGRAM_NAME
        secret = settings.BADGE_SECRET

        if not settings.BADGE_SYSTEM_SLUG:
            return "Error"

        if settings.BADGE_PROGRAM_SLUG:
            path = '/systems/' + settings.BADGE_SYSTEM_SLUG + '/issuers/' + settings.BADGE_ISSUER_SLUG + '/programs/' + settings.BADGE_PROGRAM_SLUG + '/badges'

        elif settings.BADGE_ISSUER_SLUG:
            path = '/systems/' + settings.BADGE_SYSTEM_SLUG + '/issuers/' + settings.BADGE_ISSUER_SLUG + '/badges'

        else:
            path = '/systems/' + settings.BADGE_SYSTEM_SLUG + '/badges'

        header = {"typ": "JWT", "alg": 'HS256'}
        body = str({"system_slug": system_slug, "system_name": system_name, "url": url + path})

        computed_hash = SHA256.new()
        computed_hash.update(body)

        payload = {
            'key': "master",
            'method': "GET",
            'path': path,
            "body": {
                "alg": "sha256",
                "hash": computed_hash.hexdigest()
            }
        }
        token = jwt.encode(payload, secret, headers=header)

        options = {
            'method': 'GET',
            'url': url + path,
            'headers': {
                'Authorization': 'JWT token="' + token + '"',
                'Content-Type': 'application/json'
            }
        }

        try:
            r = requests.get(url + path, headers=options['headers'], verify=False)
            data=r.json()
        except:
            data="Error"
        return Response(data=data, status=status.HTTP_200_OK)
