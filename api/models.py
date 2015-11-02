from django.db import models
from django.db.models import Q
from django.utils import timezone
from django.contrib.auth.models import User


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



class UserToken(models.Model):
    token = models.CharField(max_length=128)
    user = models.ForeignKey(User)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)


class UserPreferences(models.Model):
    user = models.ForeignKey(User)
    show_beta_interface = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return "%s" % self.user.username
