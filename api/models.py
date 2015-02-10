from django.db import models
from django.db.models import Q
from django.utils import timezone


class MaintenanceRecord(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(blank=True, null=True)
    title = models.CharField(max_length=256)
    message = models.TextField()
    disable_login = models.BooleanField(default=True)

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
            if record.disable_login:
                disable_login = True
        return disable_login