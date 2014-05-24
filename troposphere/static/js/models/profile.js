define(
  [
    'backbone',
    'globals'
  ],
  function (Backbone, globals) {

    return Backbone.Model.extend({
      url: globals.API_ROOT + "/profile" + globals.slash(),

      get_credentials: function () {
        return {
          provider_id: this.get('provider_id'),
          identity_id: this.get('identity_id')
        };
      },

      parse: function (response) {
        var attributes = response;

        attributes.id = response.username;
        attributes.userid = response.username;
        attributes.ec2_access_key = null;
        attributes.ec2_secret_key = null;
        attributes.ec2_url = null;
        attributes.s3_url = null;
        attributes.token = null;
        attributes.api_server = null;
        attributes.default_vnc = response.vnc_resolution;
        attributes.background = response.background;
        attributes.send_emails = response.send_emails;
        attributes.default_size = response.default_size;
        attributes.quick_launch = response.quick_launch;
        attributes.icon_set = response.icon_set;
        attributes.settings = {};
        attributes.settings.background = response.background;
        attributes.settings.default_size = response.default_size;
        attributes.settings.default_vnc = response.default_vnc;
        attributes.settings.icon_set = response.icon_set;
        attributes.settings.quick_launch = response.quick_launch;
        attributes.settings.send_emails = response.send_emails;

        return attributes;
      }

    });

  });
