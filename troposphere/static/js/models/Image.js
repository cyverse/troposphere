import _ from 'underscore';
import Backbone from 'backbone';
import globals from 'globals';
import CryptoJS from 'crypto-js';
import moment from 'moment';

export default Backbone.Model.extend({
    urlRoot: globals.API_V2_ROOT + "/images",

    parse: function (attributes) {
        // todo: move this feature into ImageBookmarksStore
        attributes.isFavorited = true; //response.is_bookmarked;
        attributes.start_date = moment(attributes.start_date);
        attributes.end_date = moment(attributes.end_date); // might be null, which is an Invalid Date
        attributes.description = attributes.description || "";
        attributes.uuid_hash = attributes.uuid_hash || CryptoJS.MD5((attributes.uuid).toString()).toString();


        return attributes;
    },

    toJSON: function (options) {
        var attributes = _.clone(this.attributes);
        attributes.is_bookmarked = attributes.isFavorited;
        delete attributes['isFavorited'];
        return attributes;
    },
});
