import logging

from flask import Flask
from flask import render_template, redirect, url_for, request, abort
import requests

from troposphere.cas import (cas_logoutRedirect, cas_loginRedirect,
                             cas_validateTicket)
from troposphere.oauth import generate_access_token

logger = logging.getLogger(__name__)
app = Flask(__name__)

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

    return redirect(cas_loginRedirect('/application/'))

@app.route('/logout')
def logout():
    #django_logout(request)
    if request.POST.get('cas', False):
        return redirect(cas_logoutRedirect())
    return redirect(app.config['REDIRECT_URL'] + '/login')

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
    sendback = request.args.get('sendback', None)
    ticket = request.args.get('ticket', None)
    if not ticket:
        logger.info("No Ticket received in GET string")
        abort(400)

    try:
        user = cas_validateTicket(ticket, sendback)
    except InvalidTicket:
        return redirect(url_for('application'))
    except:
        abort(500)

    logger.debug(user + " successfully authenticated against CAS")

    # Now check Groupy
    key = open(app.config['OAUTH_PRIVATE_KEY'], 'r').read()
    try:
        token = generate_access_token(key, user)
        logger.debug("TOKEN: " + token)
        return redirect(sendback)
    except:
        abort(403)

@app.errorhandler(403)
def no_user(e):
    logger.debug(e)
    return "You're not an Atmopshere user"

@app.route('/application', defaults={'path': ''})
@app.route('/application/', defaults={'path': ''})
@app.route('/application/<path:path>')
def application(path):
    return render_template('application.html')

if __name__ == '__main__':
    app.config.from_object('troposphere.settings')
    app.run(host='0.0.0.0', debug=True)
