
import toastr from 'toastr';
import _ from 'underscore';

toastr.options = {
    "closeButton": true,
    "timeOut": "0",
    "extendedTimeOut": "0"
};

let notify = function(type, title, message, options) {
    options = options || {};
    options = _.defaults(options, toastr.options);

    if (type === "success") {
        toastr.success(message, title, options);
    } else if (type === "info") {
        toastr.info(message, title, options);
    } else if (type === "error") {
        toastr.error(message, title, options);
    } else if (type === "warning") {
        toastr.warning(message, title, options);
    }

};

export default {
    success: notify.bind(null, 'success'),
    info: notify.bind(null, 'info'),
    warning: notify.bind(null, 'warning'),
    error: notify.bind(null, 'error')
};
