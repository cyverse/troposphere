# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_initial_helplinks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='helplink',
            name='context',
            field=models.TextField(default=b'', null=True, blank=True),
        ),
    ]
