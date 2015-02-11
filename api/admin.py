from django.contrib import admin
from .models import MaintenanceRecord, UserToken, UserPreferences

# Register your models here.
admin.site.register(MaintenanceRecord)
admin.site.register(UserToken)
admin.site.register(UserPreferences)
