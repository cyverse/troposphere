import collections

from django.db import models
from django.db.models import Q
from django.utils import timezone

#from core.models.user import AtmosphereUser as User

class MaintenanceRecord(models.Model):
    """
    Maintenance can be activated through the database
    """
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(blank=True, null=True)
    title = models.CharField(max_length=256)
    message = models.TextField()
    disable_login = models.BooleanField(default=True)
    provider_id = models.IntegerField(null=True)

    @classmethod
    def active(cls, provider=None):
        """
        Return records that are active and where the provider is not
        set.
        """
        now = timezone.now()
        records = MaintenanceRecord.objects.filter(
            Q(start_date__lt=now),
            Q(end_date__gt=now) | Q(end_date__isnull=True))
        return records.filter(Q(provider_id__isnull=True))

    @classmethod
    def disable_login_access(cls, request):
        disable_login = False
        records = MaintenanceRecord.active()
        for record in records:
            if record.disable_login:
                disable_login = True
        return disable_login

    def __unicode__(self):
        return '%s (Maintenance Times: %s - %s Login disabled: %s)' % (
            self.title,
            self.start_date,
            self.end_date,
            self.disable_login
        )

    class Meta:
        db_table = "maintenance_record"
        app_label = "core"
