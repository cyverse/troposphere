from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.utils import timezone



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


class HelpLink(models.Model):
    link_key = models.CharField(max_length=256)
    topic = models.CharField(max_length=256)
    context = models.TextField(default='', null=True, blank=True)
    href = models.TextField()

    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return "(%s) => %s" % (self.topic, self.href)


# Save Hook(s) Here:
def get_or_create_preferences(sender, instance, created, **kwargs):
    pref, _ = UserPreferences.objects.get_or_create(user=instance)
    pref.user = instance
    pref.save()


# Instantiate the hook(s):
post_save.connect(get_or_create_preferences, sender=User)
