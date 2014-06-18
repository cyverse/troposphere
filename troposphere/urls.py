from django.conf.urls import patterns, include, url

user_match = "[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*"

urlpatterns = patterns('',
    url(r'^$', 'troposphere.views.root'),
    url(r'^application/emulate/(?P<username>(%s))[/]?$' % user_match, 'troposphere.views.emulate',
        name='emulate-user'),
    url(r'^application[/]?', 'troposphere.views.application', name='application'),
    url(r'^maintenance[/]?$', 'troposphere.views.maintenance', name='maintenance'),
    url(r'^forbidden[/]?$', 'troposphere.views.forbidden', name='forbidden'),
    url(r'^login[/]?$', 'troposphere.views.login'),
    url(r'^logout[/]?$', 'troposphere.views.logout'),
    url(r'^cas/oauth2.0[/]?$', 'troposphere.views.cas_oauth_service',
        name='cas_oauth_service'),
    url(r'^version[/]?$', 'troposphere.views.version'),
)
