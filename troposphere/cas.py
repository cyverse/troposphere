import logging

import caslib

from troposphere import settings

logger = logging.getLogger(__name__)

class InvalidTicket(Exception):
    pass

def cas_logoutRedirect():
    """
    The CAS logout endpoint
    """
    return settings.CAS_SERVER + "/cas/logout?service=" + settings.SERVER_URL

def cas_loginRedirect(redirect_url, gateway=False):
    """
    The CAS login endpoint
    """
    login_url = settings.CAS_SERVER +\
        "/cas/login?service=" + settings.SERVER_URL +\
        "/CAS_serviceValidater?sendback=" + redirect_url
    if gateway:
        login_url += '&gateway=true'
    return login_url

def parse_cas_response(cas_response):
    xml_root_dict = cas_response.map
    logger.info(xml_root_dict)
    #A Success responses will return a dict
    #failed responses will be replaced by an empty dict
    xml_response_dict = xml_root_dict.get(cas_response.type, {})
    user = xml_response_dict.get('user', None)
    pgtIOU = xml_response_dict.get('proxyGrantingTicket', None)
    return (user, pgtIOU)

def cas_validateTicket(ticket, sendback):
    """
    Method expects 2 GET parameters: 'ticket' & 'sendback'
    After a CAS Login:
    Redirects the request based on the GET param 'ticket'
    Unauthorized Users are redirected to '/' In the event of failure.
    Authorized Users are redirected to the GET param 'sendback'
    """
    logger.debug("ServiceValidate endpoint includes a ticket."
                 " Ticket must now be validated with CAS")

    # ReturnLocation set, apply on successful authentication
    cas_setReturnLocation(sendback)
    cas_response = caslib.cas_serviceValidate(ticket)
    if not cas_response.success:
        logger.debug("CAS Server did NOT validate ticket:%s"
                     " and included this response:%s"
                     % (ticket, cas_response))
        raise InvalidTicket
    user, _ = parse_cas_response(cas_response)

    if not user:
        logger.debug("User attribute missing from cas response!"
                     "This may require a fix to caslib.py")
        raise Exception("User attribute missing from CAS response")

    return user

def cas_setReturnLocation(sendback):
    """
    Reinitialize cas with the new sendback location
    keeping all other variables the same.
    """
    caslib.cas_setServiceURL(
        settings.SERVER_URL + "/CAS_serviceValidater?sendback=" + sendback
    )
