import requests
import datetime

from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User

from bs4 import BeautifulSoup


class Link(models.Model):
    url = models.URLField(blank=False)
    title = models.CharField(max_length=300, default="", blank=True)
    added = models.DateField(auto_now_add=True, default=datetime.date.today)
    tags = models.CharField(max_length=300, blank=True)
    user = models.ForeignKey(User)

    def save(self, *args, **kwargs):
        if not self.title:
            _r = requests.get(self.url)
            if _r.status_code != 200:
                self.title = self.url
            else:
                soup = BeautifulSoup(_r.text)
                if soup.title.string:
                    self.title = soup.title.string.encode('utf-8')
                else:
                    self.title = self.url
        super(Link, self).save(*args, **kwargs)

    def __unicode__(self):
        return "%s (%s)" % (self.title, self.url)

admin.site.register(Link)
