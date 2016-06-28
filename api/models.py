from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.utils import timezone



class SingletonModel(models.Model):
    """
    A model that will ensure at-most-one row exists in the database
    """

    def save(self, *args, **kwargs):
        self.pk = 1
        super(SingletonModel, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def get_instance(cls):
        try:
            return cls.objects.get(pk=1)
        except cls.DoesNotExist:
            return cls()

    class Meta:
        abstract = True


class MaintenanceRecord(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(blank=True, null=True)
    title = models.CharField(max_length=256)
    message = models.TextField()
    allow_login = models.BooleanField(default=True)

    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    @classmethod
    def active(cls, provider=None):
        """
        Return records that are active
        """
        now = timezone.now()
        records = MaintenanceRecord.objects.filter(
            Q(start_date__lt=now),
            Q(end_date__gt=now) | Q(end_date__isnull=True))
        return records.all()

    @classmethod
    def disable_login_access(cls, request):
        """
        Return true if any active record wants login disabled
        """
        disable_login = False
        records = MaintenanceRecord.active()
        for record in records:
            if record.allow_login is not True:
                disable_login = True
        return disable_login

    def __unicode__(self):
        return '%s (Maintenance Times: %s - %s Login disabled: %s)' % (
            self.title,
            self.start_date,
            self.end_date,
            not self.allow_login
        )


class UserPreferences(models.Model):
    user = models.ForeignKey(User)
    show_beta_interface = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    airport_ui = models.NullBooleanField(default=None, null=True)

    def __unicode__(self):
        return "%s" % self.user.username


portal_link_text_help_text = """
    Text used for User Portal hyperlink; state exactly as should appear.
"""

class SiteMetadata(SingletonModel):
    """
    A single model to represent metadata about the installation `site`
    of this instance of Atmosphere (UI+API).

    This captures a place to associate configuration/metadata that may
    be changed by an individals _without_ root access to the servers
    where Atmosphere is installed/deployed.

    Note: this is *not* to be confused with the django.contrib.site
    model. This is merely a singleton created in this project & shared
    no extra nor extended functionality outside of this python module.
    """
    user_portal_link = models.CharField(
        max_length=254,
        default=b"https://user.iplantcollaborative.org/dashboard/",
        help_text="Hyperlink to the User Portal for creating account.")
    user_portal_link_text = models.CharField(
        max_length=254,
        default=b"CyVerse User Management Portal",
        help_text=portal_link_text_help_text)
    account_instructions_link = models.CharField(
        max_length=254,
        default=b"http://cyverse.org/learning-center/manage-account#AddAppsServices",
        help_text="Hyperlink to instructions on creating account.")
    display_status_page_link = models.BooleanField(
        default=True,
        help_text="Whether to display a status page link.")
    status_page_link = models.CharField(
        max_length=254,
        default=b"http://atmosphere.status.io",
        help_text="Hyperlink to page communicate Atmosphere stats information.")

    class Meta:
        db_table = 'site_metadata'
        app_label = 'api'
        verbose_name = 'Site metadata'
        verbose_name_plural = verbose_name


class MaintenanceNotice(SingletonModel):
    """
    A single model to represent a message about a forthcoming maintenance.
    """
    show_message = models.BooleanField(default=False)
    message = models.TextField()
    end_date = models.DateTimeField(blank=True, null=True)

    @classmethod
    def active(cls, provider=None):
        """
        Return records that are active
        """
        now = timezone.now()
        records = MaintenanceNotice.objects.filter(
            Q(show_message=True),
            Q(end_date__gt=now) | Q(end_date__isnull=True))
        return records.all()

    def __unicode__(self):
        return "Active? {0}; End date: {1}; Message: {2}".format(
            self.show_message,
            self.end_date,
            self.message)

    class Meta:
        db_table = 'maintenance_notice'
        app_label = 'api'
        verbose_name = 'Maintenance notice'
        verbose_name_plural = verbose_name


# Save Hook(s) Here:
def get_or_create_preferences(sender, instance, created, **kwargs):
    pref, _ = UserPreferences.objects.get_or_create(user=instance)
    pref.user = instance
    pref.save()


# Instantiate the hook(s):
post_save.connect(get_or_create_preferences, sender=User)
