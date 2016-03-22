
from api.models import SiteMetadata


def get_site_metadata():
    m, _ = SiteMetadata.objects.get_or_create()
    return m
