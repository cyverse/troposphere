define(['react', 'backbone', 'underscore', 'components/mixins/modal'], function(React, Backbone, _, Modal) {

    var vent = _.extend({}, Backbone.Events);

    var ConfirmComponent = React.createClass({
        mixins: [Modal],
        getDefaultProps: function() {
            return {
                okButtonText: 'Submit',
                //onCancel: function() {},
                onConfirm: function() {}
            };
        },
        onConfirm: function() {
            this.props.onConfirm().then(function() {
                this.props.onClose();
            }.bind(this));
        },
        renderTitle: function() {
            return this.props.title;
        },
        renderBody: function() {
            return this.props.body;
        },
        renderFooter: function() {
            return React.DOM.div({},
                React.DOM.button({
                    className: 'btn btn-primary', 
                    onClick: this.onConfirm,
                }, this.props.okButtonText));
        }
    });

    /* 
     * Options:
     * onConfirm: Promise to execute if user confirms modal.
     * onCancel: If user cancels callback
     * okButtonText: Alternate text for 'ok' button on modal. 
    */
    var doAlert = function(header, body, options) {
        vent.trigger('alert', function(onClose) {
            var props = {
                title: header,
                body: body,
                onClose: onClose
            };

            _.extend(props, options);

            return ConfirmComponent(props);
        });
    };

    return {
        events: vent,
        alert: doAlert
    };
});
