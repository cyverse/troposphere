define(function (require) {

    var _ = require('underscore'),
        Backbone = require('backbone'),
        globals = require('globals'),
        stores = require('stores'),
        CryptoJS = require('crypto-js'),
        moment = require('moment');

    return Backbone.Model.extend({

        urlRoot: globals.API_V2_ROOT + "/links",

        parse: function (attributes) {
            attributes.description = attributes.description || "";
            return attributes;
        },

    });

});
