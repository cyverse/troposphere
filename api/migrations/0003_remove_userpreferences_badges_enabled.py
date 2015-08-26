# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_userpreferences_badges_enabled'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userpreferences',
            name='badges_enabled',
        ),
    ]
