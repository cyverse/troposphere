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

    renderModal: function(ModalComponent, props, cb) {
        props = _.extend(props || {}, {
            onConfirm: cb,
            onCancel: onCancel,
            handleHidden: onCancel
        });

        var modal = React.createElement(
            MuiThemeProvider,
            { muiTheme: getMuiTheme( appTheme ) },
            React.createElement(
                ModalComponent,
                props
            )
        );

        ReactDOM.render(modal, document.getElementById("modal"));
    }
}
