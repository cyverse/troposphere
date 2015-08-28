from django.contrib import admin
from .models import MaintenanceRecord, UserToken, UserPreferences

@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ["user", "show_beta_interface", "created_date", "modified_date"]
    list_filter = [
        "show_beta_interface",
    ]


# Register your models here.
admin.site.register(MaintenanceRecord)
admin.site.register(UserToken)
