import toastr from "toastr";
import _ from "underscore";

/*
   toastr demo
   http://codeseven.github.io/toastr/demo.html

   toastr docs
   https://github.com/CodeSeven/toastr/blob/master/README.md
 */

var defaults = {
    "closeButton": true,
    "timeOut": 5000, // Time to close notification
    "extendedTimeOut": 2000 // Additional time if mouse enters
};

var noFadeDefaults = {
    "closeButton": true,
    "timeOut": 0,
    "extendedTimeOut": 0
};

export default {
    success: function(title, message, options = {}) {
        let settings = _.defaults(options, defaults);
        toastr.success(message, title, settings);
    },
    info: function(title, message, options = {}) {
        let settings = _.defaults(options, defaults);
        toastr.info(message, title, settings);
    },
    warning: function(title, message, options = {}) {
        let settings = _.defaults(options, noFadeDefaults);
        toastr.warning(message, title, settings);
    },
    error: function(title, message, options = {}) {
        let settings = _.defaults(options, noFadeDefaults);
        toastr.error(message, title, settings);
    }
};
