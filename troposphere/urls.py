from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from troposphere import settings
from troposphere import views

user_match = "[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*"

ui_urlpatterns = [
    url(r'^tropo-admin/', include(admin.site.urls)),
    url(r'^$', views.root),
    # Authentication endpoints
    url(r'', include("iplantauth.urls", namespace="iplantauth")),

    url(r'^application_backdoor', views.application_backdoor,
        name='application'),
    url(r'^application/emulate$', views.unemulate,
        name='unemulate-user'),
    url(r'^application/emulate/(?P<username>(%s))$' % user_match,
        views.emulate,
        name='emulate-user'),
    url(r'^application', views.application, name='application'),
    url(r'^atmo_maintenance$', views.atmo_maintenance,
        name='atmo_maintenance'),
    url(r'^maintenance$', views.maintenance, name='maintenance'),
    url(r'^forbidden$', views.forbidden, name='forbidden'),
    url(r'^login$', views.login),
    url(r'^logout$', views.logout),
    url(r'^cas/oauth2.0$', views.cas_oauth_service,
        name='cas_oauth_service'),
    url(r'^tests$', views.tests),
    url(r'^tropo-api/', include('api.urls')),
    url(r'^web_shell$', views.web_shell),
]

# NOTE: Have to remove the leading slash on 'BASE_URL'
base_url = settings.BASE_URL.lstrip("/")

urlpatterns = [
    url(r'^%s/' % base_url,
        include(ui_urlpatterns)),
]

#NOTE: For backward-compatibility... leave the 'non-base-url' endpoints available..
urlpatterns += ui_urlpatterns
urlpatterns += staticfiles_urlpatterns()
