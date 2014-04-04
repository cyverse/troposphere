define(['collections/notifications'], function(Notifications) {
    var notifications = new Notifications();

    /*
     * string type must be one of ['success', 'info', 'warning', danger']
     * string header
     * string body
     * object options
          boolean options.no_timeout if set to true will display the notifcation until it's been explicitly closed
    */
    var notify = function(type, header, body, options) {
        var defaults = {no_timeout: false};
        var options = options ? _.defaults(options, defaults) : defaults;
        notifications.add({
            'header': header, 
            'body': body, 
            'timestamp': new Date(), 
            'sticky': options.no_timeout,
            'type': type
        });
    };

    return {
        collection: notifications,
        success: notify.bind(null, 'success'),
        info: notify.bind(null, 'info'),
        warning: notify.bind(null, 'warning'),
        danger: notify.bind(null, 'danger')
    };

});
