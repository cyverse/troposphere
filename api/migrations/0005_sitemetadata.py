# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models

def create_sitemetadata(apps, schema_editor):
    SiteMetadata = apps.get_model("api", "SiteMetadata")
    _ = SiteMetadata.objects.get_or_create() # behold - the only record


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_userpreferences_airport_ui'),
    ]

    operations = [
        migrations.CreateModel(
            name='SiteMetadata',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user_portal_link', models.CharField(default=b'https://user.iplantcollaborative.org/dashboard/', help_text=b'Hyperlink to the User Portal for creating account.', max_length=254)),
                ('user_portal_link_text', models.CharField(default=b'CyVerse User Management Portal', help_text=b'Text used for User Portal hyperlink, \n state exactly as should appear.\n', max_length=254)),
                ('account_instructions_link', models.CharField(default=b'http://cyverse.org/learning-center/manage-account#AddAppsServices', help_text=b'Hyperlink to instructions on creating account.', max_length=254)),
            ],
            options={
                'db_table': 'site_metadata',
            },
        ),
        migrations.RunPython(create_sitemetadata)
    ]
