from django.conf.urls import patterns, include, url
from troposphere import settings
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

user_match = "[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*"
ui_urlpatterns = patterns('',
    url(r'^tropo-admin/', include(admin.site.urls)),
    url(r'^$', 'troposphere.views.root'),
    # Authentication endpoints
    url(r'', include("iplantauth.urls", namespace="iplantauth")),

    url(r'^application_backdoor', 'troposphere.views.application_backdoor', name='application'),
    url(r'^application/emulate$', 'troposphere.views.unemulate',
        name='unemulate-user'),
    url(r'^application/emulate/(?P<username>(%s))$' % user_match, 'troposphere.views.emulate',
        name='emulate-user'),
    url(r'^application', 'troposphere.views.application', name='application'),
    url(r'^atmo_maintenance$', 'troposphere.views.atmo_maintenance', name='atmo_maintenance'),
    url(r'^maintenance$', 'troposphere.views.maintenance', name='maintenance'),
    url(r'^forbidden$', 'troposphere.views.forbidden', name='forbidden'),
    url(r'^login$', 'troposphere.views.login'),
    url(r'^logout$', 'troposphere.views.logout'),
    url(r'^cas/oauth2.0$', 'troposphere.views.cas_oauth_service',
        name='cas_oauth_service'),
    url(r'^version$', 'troposphere.views.version'),
    url(r'^tests$', 'troposphere.views.tests'),
    url(r'^tropo-api/', include('api.urls')),
    url(r'^web_shell$', 'troposphere.views.web_shell'),
)

# NOTE: Have to remove the leading slash on 'BASE_URL'
base_url = settings.BASE_URL.lstrip("/")

urlpatterns = patterns('',
    url(r'^%s/' % base_url,
        include(ui_urlpatterns)),
    )
#NOTE: For backward-compatibility... leave the 'non-base-url' endpoints available..
urlpatterns += ui_urlpatterns
urlpatterns += staticfiles_urlpatterns()
