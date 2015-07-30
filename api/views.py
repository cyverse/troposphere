from rest_framework import viewsets
import requests
from rest_framework import status
import jwt
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

    def create(self, request, *args, **kwargs):
        email = User.objects.get(username=self.request.user).email
        badge = 1
        system = 'demo'
        header = {"typ": "JWT", "alg": 'HS256'}
        body = {'email': email}
        computed_hash = SHA256.new()
        computed_hash.update(body)
        payload = {'key': "master", 'method': "POST", 'path': "/systems/" + system + "/badges/" + badge + "/instance", "body": {"alg": "sha256", "hash": computed_hash.hexdigest()}}
        token = jwt.encode(payload, 'mysecret', headers=header)


        options = {
            'method': 'POST',
            'url': "http://128.196.64.125:8080/systems/" + system + "/badges/" + badge + "/instances/",
            'headers': {
                'Authorization': 'JWT token="' + token + '"',
                'Content-Type': 'application/json'
            }
        }

        r = requests.post('http://128.196.64.125:8080/systems/' + system + "/badges/" + badge + "/instances", data=body, headers=options['headers'])
        return Response(data=None, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        email = User.objects.get(username=self.request.user).email
        header = {"typ": "JWT", "alg": 'HS256'}
        body = '{"slug": "demo", "name": "Demo", "url": "http://128.196.64.125:8080/systems/demo/instances/"' + email +'"}'
        computed_hash = SHA256.new()
        computed_hash.update(body)
        payload = {'key': "master", 'method': "GET", 'path': "/systems/demo/instances/" + email, "body": {"alg": "sha256", "hash": computed_hash.hexdigest()}}
        token = jwt.encode(payload, 'mysecret', headers=header)


        options = {
            'method': 'GET',
            'url': "http://128.196.64.125:8080/systems/demo/instances/" + email,
            'headers': {
                'Authorization': 'JWT token="' + token + '"',
                'Content-Type': 'application/json'
            }
        }

        r = requests.get('http://128.196.64.125:8080/systems/demo/instances/' + email, headers=options['headers'])
        return Response(data=r.json(), status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        email = User.objects.get(username=self.request.user).email
        header = {"typ": "JWT", "alg": 'HS256'}
        body = '{"slug": "demo", "name": "Demo", "url": "http://128.196.64.125:8080/systems/demo/badges"}'
        computed_hash = SHA256.new()
        computed_hash.update(body)
        payload = {'key': "master", 'method': "GET", 'path': "/systems/demo/badges", "body": {"alg": "sha256", "hash": computed_hash.hexdigest()}}
        token = jwt.encode(payload, 'mysecret', headers=header)


        options = {
            'method': 'GET',
            'url': "http://128.196.64.125:8080/systems/demo/badges",
            'headers': {
                'Authorization': 'JWT token="' + token + '"',
                'Content-Type': 'application/json'
            }
        }

        r = requests.get('http://128.196.64.125:8080/systems/demo/badges', headers=options['headers'])
        return Response(data=r.json(), status=status.HTTP_200_OK)