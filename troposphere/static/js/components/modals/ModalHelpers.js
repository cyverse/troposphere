import React from "react";
import ReactDOM from "react-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import appTheme from 'theme/appTheme';
import _ from "underscore";

function onCancel() {
    // Important! We need to un-mount the component so it un-registers from Stores and
    // also so that we can relaunch it again later.
    ReactDOM.unmountComponentAtNode(document.getElementById("modal"));
}

export default {

    renderModal: function(ModalComponent, props, onConfirm=() => {}) {
        // Construct a promise that is resolved after the modal is hidden
        let resolve, promise = new Promise(r => resolve = r);

        let newProps = _.extend({}, props, {
            onConfirm,
            onCancel: onCancel,
            handleHidden: () => { onCancel(); resolve(); }
        });

        var modal = React.createElement(
            MuiThemeProvider,
            { muiTheme: getMuiTheme( appTheme ) },
            React.createElement(
                ModalComponent,
                newProps
            )
        );

        ReactDOM.render(modal, document.getElementById("modal"));

        // Return a promise, which can be used to chain modals, or perform any
        // action after a modal
        return promise;
    }
}
