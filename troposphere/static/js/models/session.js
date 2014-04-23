define(['models/base'], function(Base) {

    var Session = Base.extend({
        // check to see if a session is valid with isValid
        // http://backbonejs.org/#Model-isValid
        // TODO: check token expiration
        validate: function(attributes, options) {
            if(typeof(attributes.access_token) === "undefined" ||
                typeof(attributes.expires) === "undefined")
                return "Invalid access token";
        }
    });

    return Session;

});
