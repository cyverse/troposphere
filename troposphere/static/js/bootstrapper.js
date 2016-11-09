import $ from "jquery";
import _ from "underscore";
import Backbone from "backbone";
import React from "react";
import ReactDOM from "react-dom";
import SplashScreen from "components/SplashScreen.react";
import FunctionalCollection from "collections/FunctionalCollection";

// Important:
//   Disconnect all Backbone Events from Models and Collections
Object.keys(Backbone.Events).forEach(function(functionName) {
    Backbone.Model.prototype[functionName] = function() {};
    Backbone.Collection.prototype[functionName] = function() {};
});

Backbone.Collection.prototype.get = function(obj) {
    if (obj == null) return void 0;
    return _.find(this.models, function(model) {
        return model.id == obj || model.id === obj.id || model.cid === obj.cid;
    });
};

// Extend the base collection to include useful functions
_.extend(Backbone.Collection.prototype, FunctionalCollection);

export default {
    run: function() {
        let authHeaders = {
            "Content-Type": "application/json"
        }

        // Assure that an auth header is only included when we have
        // an actually `access_token` to provide.
        if (window.access_token) {
            authHeaders["Authorization"] = "Token " + window.access_token;
        }


        // Make sure the Authorization header is added to every AJAX request
        $.ajaxSetup({
            headers: authHeaders
        });

        // We're wrapping Backbone.sync so that we can observe every AJAX request.
        // If any request returns a 503 (service unavailable) then we're going to
        // throw up the maintenance splash page. Otherwise, just pass the response
        // up to chain.
        var originalSync = Backbone.sync;
        Backbone.sync = function(attrs, textStatus, xhr) {
            var dfd = $.Deferred();

            originalSync.apply(this, arguments).then(function() {
                dfd.resolve.apply(this, arguments);
            }).fail(function(response) {
                if (response.status === 503) {
                    window.location = '/maintenance'
                } else {
                    dfd.reject.apply(this, arguments);
                }
            });

            return dfd.promise();
        };

        // render the splash page which will load the rest of the application
        $(document).ready(function() {
            var SplashScreenComponent = React.createFactory(SplashScreen);
            ReactDOM.render(SplashScreenComponent(), document.getElementById("application"));
        });
    }
}
