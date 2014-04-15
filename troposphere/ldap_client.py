import ldap as ldap_driver

class LDAPClient(object):
    def __init__(self, ldap_server, dn):
        self.host = ldap_server
        self.dn = dn

    def get_group_members(self, group_name):
        ldap_server = self.host
        ldap_group_dn = self.dn.replace("ou=people", "ou=Groups")
        ldap_conn = ldap_driver.initialize(ldap_server)
        atmo_users = ldap_conn.search_s(ldap_group_dn,
                                        ldap_driver.SCOPE_SUBTREE,
                                        '(cn=%s)' % group_name)
        return atmo_users[0][1]['memberUid']
