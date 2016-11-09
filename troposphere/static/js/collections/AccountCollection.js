import Backbone from "backbone";
import Account from "models/Account";
import globals from "globals";

export default Backbone.Collection.extend({
    model: Account,

    url: globals.API_V2_ROOT + "/accounts",

    parse: function(response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };

        return response.results;
    },
    comparator: function(a, b) {
        return a.id - b.id;
    }
});
