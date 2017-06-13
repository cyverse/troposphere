from django.conf.urls import include, url
from rest_framework import routers

from api import views


router = routers.DefaultRouter(trailing_slash=False)
router.register(r'users', views.UserViewSet)
router.register(r'badges', views.BadgeViewSet, base_name='badges')
router.register(r'user_preferences', views.UserPreferenceViewSet)
router.register(r'version', views.VersionViewSet, base_name='version-tropo')

urlpatterns = [
    url(r'^', include(router.urls)),
]
