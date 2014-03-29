define(['react', 'backbone', 'underscore'], function(React, Backbone, _) {

    var vent = _.extend({}, Backbone.Events);

    /* 
     * Options:
     * onConfirm: Function to execute if user confirms modal.
     * onCancel: If user cancels callback
     * okButtonText: Alternate text for 'ok' button on modal. 
    */
    var doAlert = function(header, body, options) {
        vent.trigger('alert', {
            header: header,
            body: body,
            options: options
        });
    };

    return {
        events: vent,
        alert: doAlert
    };
});
