import Backbone from "backbone";
import globals from "globals";

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/instance_playbooks",

    isInFinalState: function() {
        let status = this.get('status');

        if(status == 'completed' || status == 'deploy_error') {
            return true;
        }
        return false;
    },

    fetchFromCloud: function(cb) {
        var url = this.urlRoot + "/" + this.id;
        Backbone.sync("read", this, {
            url: url
        }).done(function(attrs, status, response) {
            var status = attrs.status;
            this.set("status", attrs.status);
            cb(response);
        }.bind(this)).fail(function(response, status, errorThrown) {
            cb(response);
        });
    },

});
