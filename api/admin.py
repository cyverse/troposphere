from django.contrib import admin

from .models import MaintenanceRecord, UserPreferences, SiteMetadata


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ["user", "show_beta_interface", "airport_ui", "created_date", "modified_date"]
    list_filter = [
        "show_beta_interface", "airport_ui",
    ]


@admin.register(SiteMetadata)
class SiteMetadataAdmin(admin.ModelAdmin):
    actions = None # disable the `delete selected` action

    list_display = [
        "user_portal_link",
        "user_portal_link_text",
        "account_instructions_link",
        "display_status_page_link",
        "status_page_link"
    ]

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


# Register your models here.
admin.site.register(MaintenanceRecord)
