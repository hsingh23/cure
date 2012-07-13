from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *
# from django.views.decorators.cache import cache_page
from help_app.views import results
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
    # Cache this for 5 days
    url(r'^api/(.*)/$', 'results'),
    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^set-initial-json/$', 'set_initial'),
    url(r'^get-initial-json/$', 'get_initial'),

)

# urlpatterns += staticfiles_urlpatterns()
