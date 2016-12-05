import React from "react";
import ModalHelpers from "components/modals/ModalHelpers";
import ExportCredentialModal from "components/modals/ExportCredential";

import stores from "stores";


export default React.createClass({
    displayName: "ClientCredentials",

    getInitialState() {
        // the modal for exporting (cloud client) credentials will
        // need the identities available to allow for selection ...
        // this modal will be launched by this components, so we
        // are trying to do a bit of "eager" data fetching here
        return {
            displayMoreInfo: false,
            identities: stores.IdentityStore.getAll()
        };

    },

    updateState() {
        this.setState(this.getInitialState());
    },

    componentDidMount() {
        stores.IdentityStore.addChangeListener(this.updateState);
    },

    componentWillUnmount() {
        stores.IdentityStore.removeChangeListener(this.updateState);
    },

    launchExportCred() {
        ModalHelpers.renderModal(
            ExportCredentialModal,
            {},
            function() {}
        );
    },

    onDisplayMoreInfo(e) {
        e.preventDefault();

        this.setState({
            displayMoreInfo: true
        });
    },

    renderMoreInfo() {
        if (this.state.displayMoreInfo) {
            return (
            <div>
                <p>
                    Atmosphere is built on-top of "cloud providers". With exported
                    credentials, you can use the command-line interfaces (CLI) &
                    client libraries for OpenStack APIs. One such CLI is openstack,
                    it is generally equivalent to the CLIs provided by the OpenStack
                    project client libraries, but with a distinct and consistent
                    command structure.
                </p>
                <p>
                    For more information about the openstack CLI, see the
                    OpenStack <a href="http://docs.openstack.org/developer/python-openstackclient/man/openstack.html">
                    documentation</a>.
                </p>
            </div>
            );
        }
        return (
        <p>
            Click <a onClick={this.onDisplayMoreInfo}>here</a> to learn more.
        </p>
        );
    },

    render() {
        return (
        <div>
            <h3>Export Credentials</h3>
            <div style={{maxWidth: "600px"}}>
                <p>
                    Bring your credentials outside of Atmosphere to use with client libraries & other cloud tools.
                    Once you have credentials exported, you can directly use OpenStack API clients.
                </p>
                {  this.renderMoreInfo() }
                <button onClick={this.launchExportCred}>
                    Export
                </button>
            </div>

        </div>
        );
    }
});
