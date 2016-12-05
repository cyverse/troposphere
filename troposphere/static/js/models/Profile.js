import Backbone from "backbone";
import globals from "globals";

export default Backbone.Model.extend({
    url: globals.API_ROOT + "/profile",

    parse: function(response) {
        var attributes = response;

        attributes.id = response.username;
        attributes.userid = response.username;

        /**
         * FIXME: several values are missing from Profile
         *
         * ideally, we need to evaluate if the following
         * should be included in the Profile model
         *
         * "email": "lenards@cyverse.org",
         * "groups": "[<Group: lenards>]",
         * "is_expired": false,
         * "is_staff": true,
         * "is_superuser": true,
         */
        attributes.is_expired = response.is_expired;

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
