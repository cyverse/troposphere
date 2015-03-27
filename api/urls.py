from django.conf.urls import patterns, include, url
from rest_framework import routers
from api import views

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'users', views.UserViewSet)
router.register(r'user_preferences', views.UserPreferenceViewSet)

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
)
