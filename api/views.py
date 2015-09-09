from rest_framework import viewsets
import requests
from rest_framework import status
import jwt
import json
from troposphere import settings
from Crypto.Hash import SHA256
from rest_framework.response import Response
from django.contrib.auth.models import User
from api.models import UserPreferences
from .serializers import UserSerializer, UserPreferenceSerializer


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
        path = '/systems/' + system_slug + '/issuers/' + issuer_slug + '/programs/' + program_slug + '/badges/' + badge + '/instances'
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
        try:
            r = requests.post(url + path, data=body, headers=options['headers'], verify=False)
            data = r.json()
        except: 
            data = "Error"
        return Response(data=data, status=status.HTTP_201_CREATED)

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
        
        try:
            r = requests.get(url + path, headers=options['headers'], verify=False)
            data = r.json()
        except:
            data = "Error"
        return Response(data=data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        url = settings.BADGE_API_HOST
        system_slug = settings.BADGE_SYSTEM_SLUG
        system_name = settings.BADGE_SYSTEM_NAME
        issuer_slug = settings.BADGE_ISSUER_SLUG
        issuer_name = settings.BADGE_ISSUER_NAME
        program_slug = settings.BADGE_PROGRAM_SLUG
        program_name = settings.BADGE_PROGRAM_NAME
        secret = settings.BADGE_SECRET

        path = '/systems/' + system_slug + '/issuers/' + issuer_slug + '/programs/' + program_slug + '/badges'
        header = {"typ": "JWT", "alg": 'HS256'}
        body = str({"system_slug": system_slug, "system_name": system_name, "url": url + path})

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

        try:
            r = requests.get(url + path, headers=options['headers'], verify=False)
            data=r.json()
        except:
            data="Error"
        return Response(data=data, status=status.HTTP_200_OK)
