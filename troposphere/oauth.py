import jwt
import requests
from troposphere import settings

def generate_access_token(pem_id_key, sub, iss='atmo-web',
                          scope='atmosphere'):
    if not pem_id_key:
        raise Exception("Private key missing. "
                        "Key is required for JWT signature")
    #1. Create and encode JWT (using our pem key)
    kwargs = {'iss': iss,
              'scope': scope}
    if sub:
        kwargs['sub'] = sub
    jwt_object = jwt.create(**kwargs)
    encoded_sig = jwt.encode(jwt_object, pem_id_key)

    #2. Pass JWT to gables and return access_token
    #If theres a 'redirect_uri' then redirect the user
    response = requests\
        .post("%s/o/oauth2/token" % settings.GROUPY_SERVER,
              data={
                  'assertion': encoded_sig,
                  'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer'
                  })
    if response.status_code != 200:
        raise Exception("Failed to generate auth token. Response:%s"
                        % response.__dict__)
    json_obj = response.json()
    access_token = json_obj['access_token']
    return access_token

