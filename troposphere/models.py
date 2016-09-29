import uuid
import inspect

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.core import validators
from django.core.mail import send_mail
from django.conf import settings
from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.utils import timezone
from threepio import logger
from django.utils.translation import ugettext_lazy as _


class TroposphereUser(AbstractBaseUser, PermissionsMixin):
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    end_date = models.DateTimeField(null=True, blank=True)
    # Ripped from django.contrib.auth.models to force a larger max_length:
    username = models.CharField(
        _('username'),
        max_length=256,
        unique=True,
        help_text=_('Required. 256 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[
            validators.RegexValidator(
                r'^[\w.@+-]+$',
                _('Enter a valid username. This value may contain only '
                  'letters, numbers ' 'and @/./+/-/_ characters.')
            ),
        ],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    first_name = models.CharField(_('first name'), max_length=64, blank=True)
    last_name = models.CharField(_('last name'), max_length=256, blank=True)
    # These methods unchanged from 'AbstractUser'
    email = models.EmailField(_('email address'), blank=True)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    objects = UserManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'troposphere_user'

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        "Returns the short name for the user."
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """
        Sends an email to this User.
        """
        send_mail(subject, message, from_email, [self.email], **kwargs)
    # END-rip.

    def group_ids(self):
        return self.group_set.values_list('id', flat=True)

    def is_valid(self):
        """
        Call validation plugin to determine user validity
        """
        #FIXME: Improvement for later: Use the atmosphere code as a guide for is_valid
        return True

    @property
    def is_enabled(self):
        """
        User is enabled if:
        1. They do not have an end_date
        _OR_ They have an end_date that is not past the current time
        2. The 'is_active' flag is True
        """
        now_time = timezone.now()
        return self.is_active and \
            (not self.end_date or self.end_date > now_time)

    def email_hash(self):
        m = md5()
        m.update(self.user.email)
        return m.hexdigest()
