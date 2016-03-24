from django.conf.urls import patterns, include, url
from rest_framework import routers

from api import views


router = routers.DefaultRouter(trailing_slash=False)
router.register(r'users', views.UserViewSet)
router.register(r'badges', views.BadgeViewSet, base_name='badges')
router.register(r'user_preferences', views.UserPreferenceViewSet)
router.register(r'version', views.VersionViewSet, base_name='version-tropo')

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
)
