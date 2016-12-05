import Backbone from "backbone";
import globals from "globals";

export default Backbone.Model.extend({

    parse: function(response) {
        // simple pass-through, no modifications yet
        return response;
    },

    url: function() {
        let identityId = this.get("identity_uuid");

        return (
        globals.API_V2_ROOT +
        "/identities/" + identityId +
        "/export"
        );
    }
});
