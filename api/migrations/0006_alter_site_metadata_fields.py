# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_sitemetadata'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='sitemetadata',
            options={'verbose_name': 'Site metadata', 'verbose_name_plural': 'Site metadata'},
        ),
        migrations.AlterField(
            model_name='sitemetadata',
            name='user_portal_link_text',
            field=models.CharField(default=b'CyVerse User Management Portal', help_text=b'\n    Text used for User Portal hyperlink; state exactly as should appear.\n', max_length=254),
        ),
    ]
