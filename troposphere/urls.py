from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^$', 'troposphere.views.root'),
    url(r'^application$', 'troposphere.views.application', name='application'),
    url(r'^maintenance$', 'troposphere.views.maintenance', name='maintenance'),
    url(r'^login$', 'troposphere.views.login'),
    url(r'^cas/service$', 'troposphere.views.cas_service', name='cas_service'),
)
