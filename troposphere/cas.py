import logging

import caslib

from troposphere import settings

logger = logging.getLogger(__name__)

class InvalidTicket(Exception):
    pass

class CASClient(object):
    def __init__(self, cas_server, server_url, validator_url):
        self.cas_server = cas_server
        self.server_url = server_url
        self.validator_url = validator_url
        caslib.cas_init(self.cas_server, self.validator_url)

    def get_logout_endpoint(self):
        return self.cas_server + "/cas/logout?service=" + self.server_url

    def get_login_endpoint(self, redirect_url, gateway=False):
        login_url = settings.CAS_SERVER +\
            "/cas/login?service=" + settings.SERVER_URL +\
            "/CAS_serviceValidater?sendback=" + redirect_url
        if gateway:
            login_url += '&gateway=true'
        return login_url

    @staticmethod
    def parse_cas_response(cas_response):
        xml_root_dict = cas_response.map
        logger.info(xml_root_dict)
        #A Success responses will return a dict
        #failed responses will be replaced by an empty dict
        xml_response_dict = xml_root_dict.get(cas_response.type, {})
        user = xml_response_dict.get('user', None)
        pgtIOU = xml_response_dict.get('proxyGrantingTicket', None)
        return (user, pgtIOU)

    def validate_ticket(self, ticket, sendback):
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
        self.set_return_location(sendback)
        cas_response = caslib.cas_serviceValidate(ticket)
        if not cas_response.success:
            logger.debug("CAS Server did NOT validate ticket:%s"
                         " and included this response:%s"
                         % (ticket, cas_response))
            raise InvalidTicket
        user, _ = CASClient.parse_cas_response(cas_response)

        if not user:
            logger.debug("User attribute missing from cas response!"
                         "This may require a fix to caslib.py")
            raise Exception("User attribute missing from CAS response")

        return user

    def set_return_location(self, sendback):
        """
        Reinitialize cas with the new sendback location
        keeping all other variables the same.
        """
        caslib.cas_setServiceURL(
            self.server_url + "/CAS_serviceValidater?sendback=" + sendback
        )
