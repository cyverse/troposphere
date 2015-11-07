import _ from 'underscore';
import Backbone from 'backbone';
import globals from 'globals';
import moment from 'moment';

let Project = Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/providers",

    parse: function(response) {
        response.start_date = moment(response.start_date);
        response.end_date = moment(response.end_date);
        return response;
    }

});

export default Project;
