define(function (require) {

    var _ = require('underscore'),
        Backbone = require('backbone'),
        globals = require('globals'),
        stores = require('stores'),
        CryptoJS = require('crypto-js'),
        ImageVersionCollection = require('../collections/ImageVersionCollection'),
        ProviderCollection = require('../collections/ProviderCollection'),
        ProviderMachineCollection = require('../collections/ProviderMachineCollection'),
        moment = require('moment');

    return Backbone.Model.extend({

        urlRoot: globals.API_V2_ROOT + "/images",

        parse: function (attributes) {
            // todo: move this feature into ImageBookmarksStore
            attributes.isFavorited = true; //response.is_bookmarked;
            attributes.start_date = moment(attributes.start_date);
            attributes.end_date = moment(attributes.end_date);
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

});
