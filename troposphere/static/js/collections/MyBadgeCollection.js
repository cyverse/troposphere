import Backbone from "backbone";
import Badge from "models/Badge";
import globals from "globals";

export default Backbone.Collection.extend({
    model: Badge,
    url: globals.BADGE_HOST + "/1",

    parse: function(response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };
        return response.instances.map(function(instance) {
            instance.badge.assertionUrl = instance.assertionUrl;
            instance.badge.issuedOn = instance.issuedOn;
            return instance.badge;
        });
    }
});
