import React from "react";
import ReactDOM from "react-dom";
import stores from "stores";
import ToggleButton from "components/common/ToggleButton";
import SelectMenu from "components/common/ui/SelectMenu";

import { trackAction } from "../../utilities/userActivity";


export default React.createClass({
    displayName: "AccountCreateView",

    componentDidMount() {
        stores.QuotaStore.addChangeListener(this.updateState);
        stores.ProviderStore.addChangeListener(this.updateState);
        if(this.refs.atmosphereUsername != null) {
            ReactDOM.findDOMNode(this.refs.atmosphereUsername).select();
        }
    },
    componentWillUnmount() {
        stores.QuotaStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
    },
    updateState() {
        // If new models come along trigger a re-render
        this.forceUpdate();
    },

    getInitialState: function() {
        return {
            atmosphereUsername: "",
            atmosphereGroupname: "",
            provider: null,
            quota: null,
            createAccount: false,
            adminAccount: false,
        };
    },

    validateGroupname: function () {
        let name = this.state.atmosphereGroupname;
        let hasError = false;
        let message = "";
        let maxCharLen = 128;

        if (name === "") {
            hasError = true;
            message = "This field is required";
        }

        if (name.length > maxCharLen) {
            hasError = true;
            message = `Must be less than ${maxCharLen} characters long`;
        }

        return {
            hasError,
            message
        }
    },

    validateUsername: function () {
        let name = this.state.atmosphereUsername;
        let hasError = false;
        let message = "";
        let maxCharLen = 128;

        if (name === "") {
            hasError = true;
            message = "This field is required";
        }

        if (name.length > maxCharLen) {
            hasError = true;
            message = `Must be less than ${maxCharLen} characters long`;
        }

        return {
            hasError,
            message
        }
    },

    validateCredentials: function () {
        let credentials = this.state.accountCredentials;
        let hasError = false;
        let message = "";

        if (credentials === "") {
            hasError = true;
            message = "This field is required";
        }
        try {
            let json_data = JSON.parse(credentials);
            if(!json_data.length) {
                throw "JSON object is not an array";
            }
            for (var i=0;i<json_data.length;i++) {
                let cred = json_data[i];
                if (!cred.key || !cred.value) {
                    throw "JSON object "+i+" missing keys: [key, value]";}
            }
        } catch (e) {
            hasError = true;
            message = 'Valid JSON object expected, format: [{"key":"key", "value":"username"}, ...] - ' + e;
        }

        return {
            hasError,
            message
        }
    },

    isSubmittable: function () {
        if (!this.validateUsername().hasError &&
            !this.validateGroupname().hasError &&
            !this.validateCredentials().hasError
            ) {
            return true;
        }

        return false;
    },

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        if (this.isSubmittable()) {
            let quota = (this.state.quota) ? this.state.quota.get('uuid') : null;
            let accountPostData = {
                'atmo_user': this.state.atmosphereUsername.trim(),
                'atmo_group': this.state.atmosphereGroupname.trim(),
                'credentials': JSON.parse(this.state.accountCredentials),
                'quota': quota,
                'provider': this.state.provider.get('uuid'),
                'create_account': this.state.createAccount,
                'admin_account': this.state.adminAccount
            }
            this.props.onConfirm(accountPostData);
        }
        trackAction("created-account", {});
        this.setState({
            showValidation: true
        });
    },

    // todo: I don't think there's a reason to update state unless
    // there's a risk of the component being re-rendered by the parent.
    // Should probably verify this behavior, but for now, we play it safe.
    onUsernameChange: function(e) {
        this.setState({
            atmosphereUsername: e.target.value
        });
    },

    onUsernameBlur: function () {
        let atmosphereUsername = this.state.atmosphereUsername.trim();
        this.setState({
            atmosphereUsername
        });
    },

    onGroupnameChange: function(e) {
        this.setState({
            atmosphereGroupname: e.target.value
        });
    },

    onGroupnameBlur: function () {
        let atmosphereGroupname = this.state.atmosphereGroupname.trim();
        this.setState({
            atmosphereGroupname
        });
    },

    onCredentialsChange: function(e) {
        this.setState({
            accountCredentials: e.target.value
        });
    },

    onAdminAccountChange: function(new_status, e) {
        this.setState({
            adminAccount: new_status,
        });
    },

    onCreateAccountChange: function(new_status, e) {
        this.setState({
            createAccount: new_status,
        });
    },

    getQuotaName: function(quota) {
        let name = quota.get("uuid");
        let cpu = quota.get("cpu");
        let memory = quota.get("memory");
        let storage = quota.get("storage");
        // TODO: include the following when needed
        //
        // currently, these values are not in the
        // initial phase of the account creation...
        //
        //let storage_count = quota.get("storage_count");
        //let instance_count = quota.get("instance_count");
        //let snapshot_count = quota.get("snapshot_count");
        //let floating_ip_count = quota.get("floating_ip_count");
        //let port_count = quota.get("port_count");

        return `${ name } (CPU: ${ cpu }, Mem: ${ memory } GB, Disk: ${ storage } GB, ...)`;
    },

    onQuotaChange: function(quota) {
        this.setState({
            quota: quota
        });
    },

    onProviderChange: function(provider) {
        this.setState({
            provider: provider
        });
    },

    renderBody: function() {
        let providerList = stores.ProviderStore.getAll();
        let quotaList = stores.QuotaStore.getAll();

        if (!quotaList || !providerList) {
            return (<div className="loading"/>);
        }
        let atmosphereUsername = this.state.atmosphereUsername;

        let usernameClassNames = "form-group";
        let usernameErrorMessage = null;

        let groupnameClassNames = "form-group";
        let groupnameErrorMessage = null;

        let credentialsClassNames = "form-group";
        let credentialsErrorMessage = null;

        if (this.state.showValidation) {
            usernameClassNames = this.validateUsername().hasError ?
                "form-group has-error" : null;
            usernameErrorMessage = this.validateUsername().message;

            groupnameClassNames = this.validateGroupname().hasError ?
                "form-group has-error" : null;
            groupnameErrorMessage = this.validateGroupname().message;

            credentialsClassNames = this.validateCredentials().hasError ?
                "form-group has-error" : null;
            credentialsErrorMessage = this.validateCredentials().message;
        }

        return (
        <div role="form">
            <div className={usernameClassNames}>
                <label htmlFor="atmosphere-username">
                    Atmosphere Username
                </label>
                <input type="text"
                    ref="atmosphereUsername"
                    className="form-control"
                    value={atmosphereUsername}
                    onChange={this.onUsernameChange}
                    onBlur={this.onUsernameBlur} />
                <span className="help-block">{usernameErrorMessage}</span>
            </div>

            <div className={groupnameClassNames}>
                <label htmlFor="atmosphere-groupname">
                    Atmosphere Group Name
                </label>
                <input type="text"
                    className="form-control"
                    value={this.state.atmosphereGroupname}
                    onChange={this.onGroupnameChange}
                    onBlur={this.onGroupnameBlur} />
                <span className="help-block">{groupnameErrorMessage}</span>
            </div>

            <div className="form-group">
                <label htmlFor="provider">
                    Provider
                </label>
                <SelectMenu id="provider"
                            placeholder='Select a Provider'
                            current={ this.state.provider }
                            optionName={ p => p.get("name") }
                            list={ providerList }
                            onSelect={ this.onProviderChange } />
            </div>
            <div className="form-group">
                <label htmlFor="quota">
                    Quota
                </label>
                <SelectMenu current={this.state.quota}
                    placeholder='Use Default Quota'
                    optionName={this.getQuotaName}
                    list={quotaList}
                    onSelect={this.onQuotaChange} />
            </div>
            <div className={credentialsClassNames}>
                <label htmlFor="account-credentials">
                    Credentials
                </label>
                <textarea type="text"
                    className="form-control"
                    placeholder='Expects a JSON array - format: [{"key":"key", "value":"username"}'
                    rows="7"
                    value={this.state.accountCredentials}
                    onChange={this.onCredentialsChange} />
                <span className="help-block">{credentialsErrorMessage}</span>
            </div>

            <div className={'form-group'}>
                <label htmlFor="create_account">
                    {"Create a New Account?"}
                </label>
                <ToggleButton
                    isEnabled={this.state.createAccount}
                    onToggle={this.onCreateAccountChange}
                />
            </div>

            <div className={'form-group'}>
                <label htmlFor="admin_account">
                    {"Is this an admin account?"}
                </label>
                <ToggleButton
                    isEnabled={this.state.adminAccount}
                    onToggle={this.onAdminAccountChange}
                />
            </div>

        </div>
        );
    },

    render: function() {
        let isSubmittable = true;
        if (this.state.showValidation) {
            if (!this.isSubmittable()) {
                isSubmittable = false
            }
        }
        return (
        <div>
            {this.renderBody()}
            <div className="modal-footer">
                <button id="cancelCreateProvider"
                    type="button"
                    className="btn btn-default"
                    onClick={this.props.cancel}>
                    Cancel
                </button>
                <button id="submitCreateProvider"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.confirm}
                    disabled={!isSubmittable}>
                    Create
                </button>
            </div>
        </div>
        );
    }
});
