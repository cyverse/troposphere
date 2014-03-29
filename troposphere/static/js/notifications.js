define(['collections/notifications'], function(Notifications) {
    var notifications = new Notifications();

    /*
     * string header
     * string body
     * object options
          boolean options.no_timeout if set to true will display the notifcation until it's been explicitly closed
          string type must be one of ['success', 'info', 'warning', danger']
    */
    var notify = function(header, body, options) {
        var defaults = {no_timeout: false, type: 'info'};
        var options = options ? _.defaults(options, defaults) : defaults;
        notifications.add({
            'header': header, 
            'body': body, 
            'timestamp': new Date(), 
            'sticky': options.no_timeout,
            'type': options.type
        });
    };

    return {
        collection: notifications,
        notify: notify
    };

});
