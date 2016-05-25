
import React from 'react';
import Backbone from 'backbone';
import _ from 'underscore';
import ModalMixin from 'components/mixins/modal';


let ConfirmComponent = React.createClass({
    mixins: [ModalMixin],
    getDefaultProps: function() {
        return {
            okButtonText: 'OK',
            //onCancel: function() {},
        };
    },

    onConfirm: function() {
        if (this.props.onConfirm) {
            this.props.onConfirm().done(function() {
                this.close();
            }.bind(this));
        } else {
            this.close();
        }
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
                onClick: this.onConfirm
            }, this.props.okButtonText));
    }

});

let mountModal = function(modalComponent) {
    React.render(modalComponent, document.getElementById('modal'));
};

/*
 * Options:
 * onConfirm: Promise to execute if user confirms modal.
 * okButtonText: Alternate text for 'ok' button on modal.
 */
let doAlert = function(header, body, options) {
    var props = {
        title: header,
        body: body
    };

    _.extend(props, options);
    var component = ConfirmComponent(props);
    mountModal(component);
};

export default {
    alert: doAlert,
    show: mountModal
};
