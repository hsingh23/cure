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
    url(r'^auth/$', 'authenticate'),

    url(r'^make/$', 'make_help'),
    url(r'^$', 'help'),
    url(r'^help(\d{1,2})/$', 'help_itter'),
    # Cache this for 5 days
    url(r'^api/(.*)/$', 'results'),
    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    url(r'^get-initial/$', 'get_initial'),
    url(r'^make-help-json/$', 'make_help_json'),
    url(r'^make-help-url/$', 'make_help_url'),
    url(r'^post-submit-json/$', 'post_submit_json'),
    url(r'^post-submit-url/$', 'post_submit_url'),


)
# urlpatterns += staticfiles_urlpatterns()
