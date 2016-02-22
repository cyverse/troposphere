# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_transition_to_iplantauth_mod'),
    ]

    operations = [
        migrations.AddField(
            model_name='userpreferences',
            name='airport_ui',
            field=models.NullBooleanField(default=None),
            preserve_default=True,
        ),
    ]
