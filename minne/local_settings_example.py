DEBUG = False
TEMPLATE_DEBUG = DEBUG

ALLOWED_HOSTS = ['www.example.com']

# Set your site url for security
# Mandatory for django-browserid when DEBUG = False
SITE_URL = 'http://www.example.com'

# If you want to allow people to create account on your instance set True
# BROWSERID_CREATE_USER = False
