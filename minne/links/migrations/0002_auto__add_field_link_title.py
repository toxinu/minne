# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Link.title'
        db.add_column(u'links_link', 'title',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=300),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Link.title'
        db.delete_column(u'links_link', 'title')


    models = {
        u'links.link': {
            'Meta': {'object_name': 'Link'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '300'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['links']