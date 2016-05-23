import Backbone from 'backbone';
import globals from 'globals';
import moment from 'moment';

export default Backbone.Model.extend({
    urlRoot: function() {
        var creds = this.creds;
        var url = globals.API_V2_ROOT +
            '/provider_machines';
        return url;
    },

    parse: function(attributes) {
        attributes.start_date = moment(attributes.start_date);
        attributes.end_date = moment(attributes.end_date);
        return attributes;
    }
});
