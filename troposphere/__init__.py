import logging

from flask import Flask
from flask import render_template, redirect, url_for, request, abort, g
import requests

from troposphere.cas import CASClient, InvalidTicket
from troposphere.oauth import OAuthClient, Unauthorized

logger = logging.getLogger(__name__)
app = Flask(__name__)

def get_oauth_client():
    if not hasattr(g, 'oauth_client'):
        key = open(app.config['OAUTH_PRIVATE_KEY'], 'r').read()
        g.oauth_client = OAuthClient(app.config['OAUTH_SERVER'],
                                     key,
                                     app.config['OAUTH_ISS'],
                                     app.config['OAUTH_SCOPE'])
    return g.oauth_client

def get_cas_client():
    if not hasattr(g, 'cas_client'):
        validator_url = url_for('cas_service_validator',
                                sendback='/application')
        g.cas_client = CASClient(app.config['CAS_SERVER'],
                                 app.config['SERVER_URL'],
                                 validator_url)
    return g.cas_client

def get_maintenance():
    """
    Returns a list of maintenance records along with a boolean to indicate
    whether or not login should be disabled
    """
    return ([], False)

@app.route('/')
def redirect_app():
    return "Redirect"

@app.errorhandler(503)
def handle_maintenance():
    return "We're undergoing maintenance"

@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    CAS Login : Phase 1/3 Call CAS Login
    """
    records, disabled_login = get_maintenance()
    if disabled_login:
        abort(503)

    service_url = url_for('cas_service_validator',
                          sendback='/application',
                          _external=True)
    return redirect(get_cas_client().get_login_endpoint(service_url))

@app.route('/logout')
def logout():
    """
    TODO: Destroy OAuth session
    """
    if request.args.get('cas', False):
        return redirect(get_cas_client().get_logout_endpoint())
    return redirect(url_for('application'))

@app.route('/CAS_serviceValidater')
def cas_service_validator():
    """
    Method expects 2 GET parameters: 'ticket' & 'sendback'
    After a CAS Login:
    Redirects the request based on the GET param 'ticket'
    Unauthorized Users are returned a 401
    Authorized Users are redirected to the GET param 'sendback'
    """
    logger.debug('GET Variables:%s' % request.args)
    sendback = request.args.get('sendback', '')
    ticket = request.args.get('ticket', None)
    if not ticket:
        logger.info("No Ticket received in GET string")
        abort(400)

    sendback = url_for('cas_service_validator', sendback=sendback)

    try:
        user = get_cas_client().validate_ticket(ticket, sendback)
    except InvalidTicket:
        return redirect(url_for('application'))

    logger.debug(user + " successfully authenticated against CAS")

    # Now check Groupy
    try:
        token = get_oauth_client().generate_access_token(user)
        logger.debug("TOKEN: " + token)
        return redirect(sendback)
    except Unauthorized:
        abort(403)

@app.errorhandler(403)
def no_user(e):
    logger.debug(e)
    return "You're not an Atmopshere user"

@app.route('/application', defaults={'path': ''})
@app.route('/application/<path:path>')
def application(path):
    return render_template('application.html')

if __name__ == '__main__':
    app.config.from_pyfile('troposphere.cfg')
    app.run(host='0.0.0.0', debug=True)
