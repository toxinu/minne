import os
from django.http import HttpResponse
from django.conf.urls import *

urlpatterns = patterns('bibliotek.links.views',
    url(r'^$', lambda x: HttpResponse(open(os.path.join(os.path.dirname(__file__), '..', 'static', 'links', 'index.html'), 'r'))),
)
