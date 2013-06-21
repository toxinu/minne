from django.conf import settings
from django.conf.urls import patterns, include, url
from rest_framework import routers
from django.contrib import admin
from bibliotek.links import views
from bibliotek.links.models import Link

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', include('bibliotek.links.urls')),
    url(r'^api/links/(?P<pk>[0-9]+)', views.LinkDetail.as_view()),
    url(r'^api/links/search', views.links_search),
    url(r'^api/links', views.LinkList.as_view()),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)

if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^uploads/(?P<path>.*)$',
         'django.views.static.serve',
         {'document_root': settings.MEDIA_ROOT},
        ),
    )
