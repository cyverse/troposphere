from django.contrib import admin

from .models import MaintenanceRecord, UserPreferences, HelpLink


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ["user", "show_beta_interface", "airport_ui", "created_date", "modified_date"]
    list_filter = [
        "show_beta_interface", "airport_ui",
    ]


@admin.register(HelpLink)
class HelpLinkAdmin(admin.ModelAdmin):
    actions = None # disable the `delete selected` action

    list_display = ["link_key", "topic", "context", "href"]

    def get_readonly_fields(self, request, obj=None):
        if obj: # editing an existing object
            return self.readonly_fields + ("link_key", )
        return self.readonly_fields

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


# Register your models here.
admin.site.register(MaintenanceRecord)
