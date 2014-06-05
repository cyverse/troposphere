from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^$', 'troposphere.views.root'),
    url(r'^application', 'troposphere.views.application', name='application'),
    url(r'^maintenance$', 'troposphere.views.maintenance', name='maintenance'),
    url(r'^forbidden$', 'troposphere.views.forbidden', name='forbidden'),
    url(r'^login$', 'troposphere.views.login'),
    url(r'^logout$', 'troposphere.views.logout'),
    url(r'^cas/oauth2.0$', 'troposphere.views.cas_oauth_service',
        name='cas_oauth_service'),
)
