import $ from "jquery";
import _ from "underscore";
import Backbone from "backbone";
import React from "react";
import ReactDOM from "react-dom";
import SplashScreen from "components/SplashScreen.react";
import MaintenanceScreen from "components/MaintenanceScreen.react";
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
            // NOTE: a conceptually simpler solution would be to do this:
            //
            //    var xhr = originalSync.apply(this, arguments).catch(function(response){
            //      if(response.status === 503) {
            //        $('.splash-image').remove();
            //        var MaintenanceComponent = React.createFactory(MaintenanceScreen);
            //        ReactDOM.render(MaintenanceComponent(), document.getElementById('application'));
            //      }
            //    });
            //
            //    return xhr;
            //
            // However, since we're using jQuery deferred objects for the promise chain, and they
            // don't have a way to cancel promise propagation, we can end up in a scenario where we
            // display a toast with an error on the maintenance splash screen (because other error
            // handlers can still get called).  To get around that, we need to create our own promise
            // and, based on the result of the AJAX request, either manually resolve or reject it.


            var dfd = $.Deferred();

            originalSync.apply(this, arguments).then(function() {
                dfd.resolve.apply(this, arguments);
            }).fail(function(response) {
                if (response.status === 503) {
                    // need to make sure we remove the splash-image element is included in the HTML
                    // template by default but re-apply the splash screen-class to body so that the
                    // splash page displays correctly
                    $(".splash-image").remove();
                    $("body").addClass("splash-screen");

                    // replace the current view with the
                    var MaintenanceComponent = React.createFactory(MaintenanceScreen);
                    ReactDOM.render(MaintenanceComponent(), document.getElementById("application"));
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
