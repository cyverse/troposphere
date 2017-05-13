import json
import time
import uuid
import hmac
import hashlib
import base64
import requests
import logging

from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseRedirect, UnreadablePostError

logger = logging.getLogger(__name__)

guac_server = settings.GUACAMOLE['SERVER_URL']
secret = settings.GUACAMOLE['SECRET_KEY']

# This function will be called by a POST request made to the URL /guacamole from a button
# defined in troposphere/static/js/components/projects/resources/instance/details/actions/InstanceActionsAndLinks.jsx
def guacamole(request):

    if request.user.is_authenticated():
        logger.info("User is authenticated.")

        # Create UUID for connection ID
        conn_id = str(uuid.uuid4())
        base64_conn_id = base64.b64encode(conn_id[2:] + "\0" + 'c' + "\0" + 'hmac')

        # Create timestamp that looks like: 1489181545018
        timestamp = str(int(round(time.time()*1000)))

        if 'ipAddress' in request.POST and 'protocol' in request.POST:

            # Get IP, protocol, and username from request that was sent from button click
            ip_address = request.POST['ipAddress']
            protocol = request.POST['protocol']
            atmo_username = request.session.get('username','')

            logger.info("User %s initiated %s connection to %s" % (atmo_username, protocol.upper(), ip_address))

            # Change some parameters depending on SSH or VNC protocol
            # Note: passwd is hardcoded to 'display'. This doesn't seem ideal but it is
            #       done the same in web_desktop.py
            port = '5905'
            passwd = 'display'
            if protocol == 'ssh':
                port = '22'
                passwd = ''

            # Concatenate info for a message
            message = timestamp + protocol + ip_address + port + atmo_username + passwd

            # Hash the message into a signature
            signature = hmac.new(secret, message, hashlib.sha256).digest().encode("base64").rstrip('\n')

            # Build the POST request
            request_string = ('timestamp=' + timestamp
                              + '&guac.port=' + port
                              + '&guac.username=' + atmo_username
                              + '&guac.password=' + passwd
                              + '&guac.protocol=' + protocol
                              + '&signature=' + signature
                              + '&guac.hostname=' + ip_address
                              + '&id=' + conn_id)

            # SFTP is only enabled for SSH because when using SSH, the user enters their password,
            # while for a VNC connection, the user doesn't. On VNC connections this causes a connection
            # error because Guacamole cannot login to SFTP.
            if protocol == 'ssh':
                request_string += '&guac.enable-sftp=true'

            # Send request to Guacamole backend and record the result
            response = requests.post(guac_server + '/api/tokens', data=request_string)
            logger.info("Response status from server: %s" % (response.status_code))

            if response.status_code == 403:
                logger.warn("Guacamole did not accept the authentication.\nResponse content:\n%s" % (json.loads(response.content)))
                return HttpResponse("<h1>Error 403</h1><br/>Guacamole server did not accept authentication.")

            token = json.loads(response.content)['authToken']
            return HttpResponseRedirect(guac_server + '/#/client/' + base64_conn_id + '?token=' + token)
        else:
            raise UnreadablePostError

    else:
        raise PermissionDenied
