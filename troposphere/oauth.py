import jwt
import requests

class Unauthorized(Exception):
    pass

class OAuthClient(object):
    def __init__(self, oauth_server, key, iss, scope):
        self.oauth_server = oauth_server
        self.key = key
        self.iss = iss
        self.scope = scope

    def generate_access_token(self, sub=None):
        #1. Create and encode JWT (using our pem key)
        kwargs = {'iss': self.iss,
                  'scope': self.scope}
        if sub:
            kwargs['sub'] = sub
        jwt_object = jwt.create(**kwargs)
        encoded_sig = jwt.encode(jwt_object, self.key)

        #2. Pass JWT to gables and return access_token
        #If theres a 'redirect_uri' then redirect the user
        response = requests\
            .post("%s/o/oauth2/token" % self.oauth_server,
                  data={
                      'assertion': encoded_sig,
                      'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer'
                      })
        if response.status_code != 200:
            raise Unauthorized("Failed to generate auth token. Response:%s"
                            % response.__dict__)
        json_obj = response.json()
        access_token = json_obj['access_token']
        return access_token

