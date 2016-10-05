from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as AuthUserAdmin

from troposphere import models


@admin.register(models.TroposphereUser)
class UserAdmin(AuthUserAdmin):
    pass
