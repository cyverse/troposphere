# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpreferences',
            name='show_beta_interface',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
