from flask import redirect
from troposphere import settings

def cas_logoutRedirect():
    """
    Returns a redirect reponse to the CAS logout endpoint
    """
    return redirect(settings.CAS_SERVER +
                    "/cas/logout?service="+settings.SERVER_URL)

def cas_loginRedirect(redirect_url, gateway=False):
    """
    Returns a redirect response to the CAS login endpoint
    """
    login_url = settings.CAS_SERVER +\
        "/cas/login?service="+settings.SERVER_URL +\
        "/CAS_serviceValidater?sendback="+redirect_url
    if gateway:
        login_url += '&gateway=true'
    return redirect(login_url)
