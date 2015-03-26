from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import UserPreferences


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'url',
            'username',
            'first_name',
            'last_name',
            'email',
            'is_staff',
            'is_superuser',
            'date_joined'
        )


class UserPreferenceSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserPreferences
        fields = (
            'id',
            'url',
            'show_beta_interface',
            'user',
            'created_date',
            'modified_date'
        )
