import React from 'react';
import _ from 'underscore';

function onCancel() {
    // Important! We need to un-mount the component so it un-registers from Stores and
    // also so that we can relaunch it again later.
    React.unmountComponentAtNode(document.getElementById('modal'));
}

export default {

    renderModal: function(ModalComponent, props, cb){
        props = _.extend(props || {}, {
            onConfirm: cb,
            onCancel: onCancel,
            handleHidden: onCancel,
        });

        var modal = React.createElement(ModalComponent, props);
        React.render(modal, document.getElementById('modal'));
    }
}
