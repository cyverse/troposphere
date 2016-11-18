import React from "react";
import ReactDOM from "react-dom";

import moment from "moment";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin.react";
import stores from "stores";


/**
 * Merges the argument model with a `openrc` credential template.
 *
 * @param {Backbone.Model} credModel - contains credential values associated
 *                                     with a community members OpenStack identity
 */
function populateOpenRCTemplate(credModel) {
    let exportTime = moment().format("MMM DD, YYYY hh:mm a");

    let openrc = `# generated on ${exportTime}
export OS_PROJECT_NAME=${credModel.get("OS_PROJECT_NAME")}
export OS_USERNAME=${credModel.get("OS_USERNAME")}
export OS_IDENTITY_API_VERSION=${credModel.get("OS_IDENTITY_API_VERSION")}
export OS_USER_DOMAIN_NAME=${credModel.get("OS_USER_DOMAIN_NAME")}
export OS_TENANT_NAME=${credModel.get("OS_TENANT_NAME")}
export OS_AUTH_URL=${credModel.get("OS_AUTH_URL")}
export OS_PROJECT_DOMAIN_NAME=${credModel.get("OS_PROJECT_DOMAIN_NAME")}
export OS_REGION_NAME=${credModel.get("OS_REGION_NAME")}
export OS_PASSWORD=${credModel.get("OS_PASSWORD")}
`;

    return openrc;
}


export default React.createClass({

    mixins: [BootstrapModalMixin],

    getInitialState() {
        return {
            identityUUID: "",
            step: 0,
        }
    },

    updateState() {
        if (this.state.step === 0) {
            this.setState(this.getInitialState());
        } else {
            // - new data has arrived
            // - indicate a need for re-render
            this.setState(this.state);
        }
    },

    componentDidMount() {
        stores.ClientCredentialStore.addChangeListener(this.updateState);

        // NOTE: this is to avoid issues with data arriving after the
        // component as `mounted`
        this.updateState();
    },

    componentWillUnmount() {
        stores.ClientCredentialStore.removeChangeListener(this.updateState);
    },

    updateSelect(e) {
        let identityUUID = e.target.value;

        this.setState({
            identityUUID
        });
    },

    onSelect(e) {
        e.preventDefault();
        this.setState({
            identityUUID: this.state.identityUUID,
            step: 1
        });
    },

    renderIdentities(identities) {
        return identities.map((identity) => {
            let provider = identity.get("provider"),
                identityUUID = identity.get("uuid"),
                key = identity.id || identity.cid,
                inputId = provider.name.replace(' ','-') + key;

            return (
                <div key={`check-${key}`} className="form-check">
                <label className="form-check-label">
                    <input key={key}
                           id={inputId}
                           name="identities"
                           type="radio"
                           className="form-check-input"
                           value={identityUUID}
                           onChange={this.updateSelect} />
                    {` ${provider.name}`}
                </label>
                </div>
            );

        });
    },

    renderSelect(identities) {
        let cannotGenerate = true;

        if (identities) {
            cannotGenerate = false;
        }

        return (
        <div className="modal-content">
            <div className="modal-header">
                {this.renderCloseButton()}
                <h1 className="t-title">Select provider</h1>
            </div>
            <div style={{ minHeight: "300px" }} className="modal-body">
                <p>
                    Each Atmosphere "provider" will have different credentials for you.
                    Please select the provider to export:
                </p>
                <div key="export-cred-radio-grp" className="form-group">
                    {this.renderIdentities(identities)}
                </div>
            </div>
            <div className="modal-footer">
                <button type="button"
                        className="btn btn-danger"
                        onClick={this.hide}>
                    Cancel
                </button>
                <button type="button"
                        aria-invalid={cannotGenerate}
                        className="btn btn-primary"
                        onClick={this.onSelect}
                        disabled={cannotGenerate}>
                    Export
                </button>
            </div>
        </div>
        );
    },

    renderGenerate() {
        let identityUUID = this.state.identityUUID,
            credential =
                stores.ClientCredentialStore.getForIdentity(identityUUID);

        if (!credential) {
            return (
            <div className="modal-content">
                <div className="modal-header">
                    {this.renderCloseButton()}
                    <h1 className="t-title">Exporting credential ...</h1>
                </div>
                <div style={{ minHeight: "300px" }} className="modal-body">
                    <div className="loading"></div>
                </div>
            </div>
            );
        }

        let openrc = populateOpenRCTemplate(credential);

        return (
        <div className="modal-content">
            <div className="modal-header">
                {this.renderCloseButton()}
                <h1 className="t-title">Exported Credential</h1>
            </div>
            <div style={{ minHeight: "300px" }} className="modal-body">
                <p>
                    Copy the exported credential and paste into a file.
                    This file will be used within a shell scripting
                    environment to "export" the necessary information
                    used by command-line interfaces (CLI) for the
                    OpenStack APIs.
                </p>
                <pre id="openrc" ref="openrcExport">
                    {openrc}
                </pre>
            </div>
            <div className="modal-footer">
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.hide}>
                    Okay
                </button>
            </div>
        </div>
        );
    },

    renderContent(identities) {
        if (this.state.step === 0) {
            return this.renderSelect(identities);
        } else if (this.state.step === 1) {
            return this.renderGenerate();
        }
    },

    render() {
        let identities = stores.IdentityStore.getAll();

        if (!identities) {
            return (<div className="loading"></div>);
        }

        return (
        <div className="modal fade">
            <div className="modal-dialog" style={{ minWidth: "705px"}}>
                {this.renderContent(identities)}
            </div>
        </div>
        );
    }
});
