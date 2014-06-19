# -*- coding: utf-8 -*-
from django.contrib import admin
from django.conf import settings
from django.conf.urls import url
from django.conf.urls import include
from django.conf.urls import patterns
from django.core.urlresolvers import reverse_lazy
from django.views.generic import RedirectView

from .links import views

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'links/login.html'}),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {'template_name': 'links/login.html'}),
    url(r'^api/export/$', views.export_bookmarks),
    url(r'^api/links/(?P<pk>[0-9]+)', views.LinkDetail.as_view()),
    url(r'^api/links/search', views.links_search),
    url(r'^api/links', views.LinkList.as_view()),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', include('minne.links.urls')),
)

if hasattr(settings, 'BROWSERID') and settings.BROWSERID:
    urlpatterns += patterns(
        '',
        (r'^logout/$', RedirectView.as_view(url=reverse_lazy('browserid.logout'))),
        (r'^browserid/', include('django_browserid.urls')), )

if settings.DEBUG:
    urlpatterns += patterns(
        '',
        (
            r'^uploads/(?P<path>.*)$',
            'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT},
        ),
    )
