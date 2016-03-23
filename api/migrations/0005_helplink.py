# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_userpreferences_airport_ui'),
    ]

    operations = [
        migrations.CreateModel(
            name='HelpLink',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('link_key', models.CharField(max_length=256)),
                ('topic', models.CharField(max_length=256)),
                ('context', models.TextField()),
                ('href', models.TextField()),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
