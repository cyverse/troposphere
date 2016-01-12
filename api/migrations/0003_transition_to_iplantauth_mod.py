# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

def _conditional():
    try:
        from django.db.models import UserToken
        return [
            migrations.RemoveField(
                model_name='usertoken',
                name='user',
            ),
            migrations.DeleteModel(
                name='UserToken',
            ),
        ]
    except ImportError:
        return [ ]

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_ui_pref_default'),
    ]

    operations = _conditional()
