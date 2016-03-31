import _ from 'underscore';
import Backbone from 'backbone';
import globals from 'globals';
import stores from 'stores';
import CryptoJS from 'crypto-js';
import moment from 'moment';

export default Backbone.Model.extend({

    urlRoot: globals.API_V2_ROOT + "/links",

    parse: function (attributes) {
        attributes.description = attributes.description || "";
        return attributes;
    },

});
