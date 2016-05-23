# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_site_metadata_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitemetadata',
            name='display_status_page_link',
            field=models.BooleanField(default=True, help_text=b'Whether to display a status page link.'),
        ),
        migrations.AddField(
            model_name='sitemetadata',
            name='status_page_link',
            field=models.CharField(default=b'http://atmosphere.status.io', help_text=b'Hyperlink to page communicate Atmosphere stats information.', max_length=254),
        ),
    ]
