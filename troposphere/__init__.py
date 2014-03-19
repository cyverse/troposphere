from flask import Flask
from flask import render_template, redirect, url_for, request
import requests

from troposphere import settings
from troposphere.cas import cas_logoutRedirect, cas_loginRedirect


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
        return abort(503)

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
    url(r'^CAS_serviceValidater',
        'authentication.protocol.cas.cas_validateTicket'),
    """
    return "Now we check to see if the cas ticket was valid"

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
