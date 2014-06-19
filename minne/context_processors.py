from django.conf import settings


def expose_settings(request):
    if hasattr(settings, 'BROWSERID'):
        return {'BROWSERID': settings.BROWSERID}
