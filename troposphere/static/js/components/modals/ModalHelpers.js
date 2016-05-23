import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

function onCancel() {
    // Important! We need to un-mount the component so it un-registers from Stores and
    // also so that we can relaunch it again later.
    ReactDOM.unmountComponentAtNode(document.getElementById('modal'));
}

export default {

    renderModal: function(ModalComponent, props, cb){
        props = _.extend(props || {}, {
            onConfirm: cb,
            onCancel: onCancel,
            handleHidden: onCancel,
        });

        var modal = React.createElement(ModalComponent, props);
        ReactDOM.render(modal, document.getElementById('modal'));
    }
}
