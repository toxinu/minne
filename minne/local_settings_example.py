# -*- coding: utf-8 -*-
from .settings import INSTALLED_APPS
from .settings import AUTHENTICATION_BACKENDS
from .settings import TEMPLATE_CONTEXT_PROCESSORS

DEBUG = True
TEMPLATE_DEBUG = DEBUG

ALLOWED_HOSTS = ['localhost']

#############
# BrowserID #
#############
# Enable or not BrowserID
BROWSERID = False
# If you want to allow people to create account on your instance set True
# BROWSERID_CREATE_USER = False
# INSTALLED_APPS += ('django_browserid', )
# AUTHENTICATION_BACKENDS += ('django_browserid.auth.BrowserIDBackend', )
# TEMPLATE_CONTEXT_PROCESSORS += ('django_browserid.context_processors.browserid', )
# Set your site url for security
# Mandatory for django-browserid when DEBUG = False
SITE_URL = 'http://www.example.com'
