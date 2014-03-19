import logging

from flask import Flask
from flask import render_template, redirect, url_for, request
import requests

from troposphere import settings
from troposphere.cas import (cas_logoutRedirect, cas_loginRedirect,
                             cas_validateTicket)

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

    #if request.method == "POST" and 'next' in request.form:
    return cas_loginRedirect('/application/')
    #else:
        #return "Login please"

@app.route('/logout')
def logout():
    #django_logout(request)
    if request.POST.get('cas', False):
        return cas_logoutRedirect()
    return redirect(settings.REDIRECT_URL + '/login')

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
    user = cas_validateTicket(ticket, sendback)
    logger.debug(user + " successfully authenticated against CAS")
    return redirect(sendback)

@app.route('/no_user')
def no_user():
    return "You're not an Atmopshere user"

#@app.route('/CASlogin', defaults={'path': ''})
#@app.route('/CASlogin/<redirect>')
#    """
#    url(r'^CASlogin/(?P<redirect>.*)$', 'authentication.cas_loginRedirect'),
#    """
#    pass

@app.route('/application', defaults={'path': ''})
@app.route('/application/', defaults={'path': ''})
@app.route('/application/<path:path>')
def application(path):
    return render_template('application.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
