from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import UserPreferences


class UserRelatedField(serializers.PrimaryKeyRelatedField):

    def use_pk_only_optimization(self):
        return False

    def to_representation(self, value):
        serializer = UserSerializer(value, context=self.context)
        return serializer.data


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
    user = UserRelatedField(read_only=True)

    class Meta:
        model = UserPreferences
        fields = (
            'id',
            'url',
            'show_beta_interface',
            'badges_enabled',
            'user',
            'created_date',
            'modified_date'
        )
