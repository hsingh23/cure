from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

# from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = patterns('help_app.views',
    # Examples:
    # url(r'^$', 'help_app.views.home', name='home'),
    # url(r'^help_app/', include('help_app.foo.urls')),
    url(r'^help/$', 'help'),
    url(r'^make/$', 'make_help'),
    url(r'^$', 'help'),
    url(r'^help(\d{1,2})/$', 'help_itter'),
    url(r'^api/(.*)/$', 'results'),
	url(r'^refresh/(.*)/$', 'refresh'),
    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

# urlpatterns += staticfiles_urlpatterns()
