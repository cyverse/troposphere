from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import UserPreferences


class UserPreferencesSummarySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserPreferences
        fields = (
            'id',
            'url'
        )


class UserRelatedField(serializers.PrimaryKeyRelatedField):

    def use_pk_only_optimization(self):
        return False

    def to_representation(self, value):
        serializer = UserSerializer(value, context=self.context)
        return serializer.data


class UserSerializer(serializers.HyperlinkedModelSerializer):
    user_pref = UserPreferencesSummarySerializer(
        source='userpreferences_set',
        many=True)

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
            'date_joined',
            'user_pref'
        )


class UserPreferenceSerializer(serializers.HyperlinkedModelSerializer):
    user = UserRelatedField(read_only=True)

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
