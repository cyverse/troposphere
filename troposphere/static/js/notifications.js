define(['collections/notifications'], function(Notifications) {
    var notifications = new Notifications();

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
