import Backbone from 'backbone';
import HelpLink from 'models/HelpLink';
import globals from 'globals';

export default Backbone.Collection.extend({
    model: HelpLink,

    url: globals.TROPO_API_ROOT + "/help_links",

    parse: function (response) {
        this.meta = {
            count: response.count,
            next: response.next,
            previous: response.previous
        };

        return response.results;
    }
});
