import Backbone from "backbone";

import { findCookie } from "utilities/cookieHelpers";

import globals from "globals";

export default Backbone.Model.extend({

    parse(response) {
        let attributes = response;

        return attributes;
    },

    sync: function(method, collection, options){
        options = options || {};
        options.beforeSend = function (xhr) {
            // guilty-party: @lenards
            // ----------------------
            // this was added because the multiple CSRF tokens
            // within the "multi" Django deployment appears to
            // cause issues as the CSRF expected for Tropo API
            // is not, by default, included ...
            let csrftoken = findCookie("tropo_csrftoken");
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        };
        return Backbone.Model.prototype.sync.apply(this, arguments);
    },

    url() {
        let id = this.get("user").id;

        return (
            `${globals.TROPO_API_ROOT}/user_preferences/${id}`
        );
    },

    getAllowSshHyperlink() {
        return this.get("allow_ssh_hyperlinks");
    }
});
