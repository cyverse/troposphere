import React from "react";
import moment from "moment";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon"

import stores from "stores";

import { hasClipboardAPI,
         copyElement } from "utilities/clipboardFunctions";

/**
 * Merges the argument model with a `openrc` credential template.
 *
 * It uses an array of "possible" environment variables names expected from
 * the /v2/identities/:uuid/export endpoint - and only includes those that
 * have a *defined* value.
 *
 * @param {Backbone.Model} credModel - contains credential values associated
 *                                     with a community members OpenStack identity
 */
function populateOpenRCTemplate(credModel) {
    let exportTime = moment().format("MMM DD, YYYY hh:mm a"),
        envVarNames = [ "OS_PROJECT_NAME", "OS_USERNAME", "OS_IDENTITY_API_VERSION",
                        "OS_USER_DOMAIN_NAME", "OS_TENANT_NAME", "OS_AUTH_URL",
                        "OS_PROJECT_DOMAIN_NAME", "OS_REGION_NAME", "OS_PASSWORD"];

    let openrc = `# generated on ${exportTime}\n`;

    // produce an "openrc" string that includes only defined values from endpoint
    envVarNames.forEach((env) => {
        if (credModel.get(env)) {
            openrc += `export ${env}=${credModel.get(env)}\n`;
        }
    });

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

    onCopyText(e) {
        e.preventDefault();
        // copy contents of ref to clipboard
        copyElement(this.refs.openrcExport);
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
                stores.ClientCredentialStore.getForIdentity(identityUUID),
            activeButton;

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

        if (hasClipboardAPI()) {
            activeButton = (
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.onCopyText}>
                    Copy
                </button>
            );

        } else {
            activeButton = (
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.hide}>
                    Okay
                </button>
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
                <p className="alert alert-info">
                    <Glyphicon name="info-sign" />
                    {" "}
                    <strong>PLEASE NOTE</strong><br/>
                    When using these credentials, ensure that the domain
                    and port for <span style={{fontFamily: "monospace"}}>$OS_AUTH_URL</span>
                    {" "}are reachable. Simply using <span style={{fontFamily: "monospace"}}>curl</span>
                    {" "}or navigating to the base URL will help to determine reachability.
                </p>
                <pre id="openrc" ref="openrcExport">
                    {openrc}
                </pre>
            </div>
            <div className="modal-footer">
                {activeButton}
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
