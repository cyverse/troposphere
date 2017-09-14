from django.contrib import admin
from django.utils import timezone

from .models import (MaintenanceRecord, MaintenanceNotice,
                     UserPreferences, SiteMetadata)



def end_date_object(modeladmin, request, queryset):
    queryset.update(end_date=timezone.now())


end_date_object.short_description = 'Add end-date to objects'


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
        "status_page_link",
        "site_footer_link"
    ]

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(MaintenanceNotice)
class MaintenanceNoticeAdmin(admin.ModelAdmin):
    actions = None # disable the `delete selected` action

    list_display = [
        "show_message",
        "message",
        "end_date"
    ]

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(MaintenanceRecord)
class MaintenanceAdmin(admin.ModelAdmin):
    actions = [end_date_object, ]

    list_display = [
        "title",
        "start_date",
        "end_date",
        "disable_login"
    ]


# Register your models here.
#admin.site.register(SomeModelObject)
