import React from "react";
import moment from "moment";
import ToggleButton from "components/common/ToggleButton";

import { trackAction } from "../../utilities/userActivity";

export default React.createClass({
    displayName: "ProviderCreateView",

    getInitialState: function() {
        return {
            providerName: "",
            providerCloudConfig: "",
            providerCredentials: "",
            providerDescription: "",
            providerTimezone: "UTC",
            providerIsPublic: false,
            providerIsActive: true,
            providerAllowAutoImaging: true,
            //Skipped for now:
            //over_allocation_action
            showValidation: false
        };
    },

    validateName: function () {
        let name = this.state.providerName;
        let hasError = false;
        let message = "";
        let maxCharLen = 60;

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

    validateTimezone: function () {
        let name = this.state.providerTimezone;
        let hasError = false;
        let message = "";
        let tz_names = moment.tz.names();
        if (name === "") {
            hasError = true;
            message = "This field is required";
        }

        if (tz_names.indexOf(name) == -1) {
            hasError = true;
            message = "This timezone is invalid. Select a valid timezone name";
        }

        return {
            hasError,
            message
        }
    },

    validateDescription: function () {
        let description = this.state.providerDescription;
        let hasError = false;
        let message = "";

        if (description === "") {
            hasError = true;
            message = "This field is required";
        }

        return {
            hasError,
            message
        }
    },

    validateCloudConfig: function () {
        let cloud_config = this.state.providerCloudConfig;
        let hasError = false;
        let message = "";

        if (cloud_config === "") {
            hasError = true;
            message = "This field is required";
        }
        try {
            let json_data = JSON.parse(cloud_config);
            if(!json_data.network) {
                throw "Missing network section";
            }
            if(!json_data.user) {
                throw "Missing user section";
            }
            if(!json_data.deploy) {
                throw "Missing deploy section";
            }
        } catch (e) {
            hasError = true;
            message = "Valid JSON object required - " + e;
        }

        return {
            hasError,
            message
        }
    },

    validateCredentials: function () {
        let credentials = this.state.providerCredentials;
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
        if (!this.validateName().hasError &&
            !this.validateCloudConfig().hasError &&
            !this.validateCredentials().hasError &&
            !this.validateDescription().hasError &&
            !this.validateTimezone().hasError
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
            let provider_post_data = {
                'name': this.state.providerName.trim(),
                'description': this.state.providerDescription.trim(),
                'cloud_config': JSON.parse(this.state.providerCloudConfig),
                'credentials': JSON.parse(this.state.providerCredentials),
                'timezone': this.state.providerTimezone,
                'public': this.state.providerIsPublic,
                'active': this.state.providerIsActive,
                'auto_imaging': this.state.providerAllowAutoImaging
            }
            this.props.onConfirm(provider_post_data);
        }
        trackAction("created-provider", {});
        this.setState({
            showValidation: true
        });
    },

    // todo: I don't think there's a reason to update state unless
    // there's a risk of the component being re-rendered by the parent.
    // Should probably verify this behavior, but for now, we play it safe.
    onNameChange: function(e) {
        this.setState({
            providerName: e.target.value
        });
    },

    onNameBlur: function () {
        let providerName = this.state.providerName.trim();
        this.setState({
            providerName
        });
    },

    onCloudConfigChange: function(e) {
        this.setState({
            providerCloudConfig: e.target.value
        });
    },

    onDescriptionChange: function(e) {
        this.setState({
            providerDescription: e.target.value
        });
    },

    onCredentialsChange: function(e) {
        this.setState({
            providerCredentials: e.target.value
        });
    },

    onTimezoneChange: function(e) {
        this.setState({
            providerTimezone: e.target.value
        });
    },

    onIsPublicChange: function(new_status, e) {
        this.setState({
            providerIsPublic: new_status,
        });
    },

    onIsActiveChange: function(new_status, e) {
        this.setState({
            providerIsActive: new_status,
        });
    },

    onImagingChange: function(new_status, e) {
        this.setState({
            providerAllowAutoImaging: new_status,
        });
    },


    renderBody: function() {
        let providerName = this.state.providerName;
        let nameClassNames = "form-group";
        let nameErrorMessage = null;

        let cloud_configClassNames = "form-group";
        let cloud_configErrorMessage = null;

        let credentialsClassNames = "form-group";
        let credentialsErrorMessage = null;

        let descriptionClassNames = "form-group";
        let descriptionErrorMessage = null;

        let timezoneClassNames = "form-group";
        let timezoneErrorMessage = null;



        if (this.state.showValidation) {
            nameClassNames = this.validateName().hasError ?
                "form-group has-error" : null;
            nameErrorMessage = this.validateName().message;

            cloud_configClassNames = this.validateCloudConfig().hasError ?
                "form-group has-error" : null;
            cloud_configErrorMessage = this.validateCloudConfig().message;

            credentialsClassNames = this.validateCredentials().hasError ?
                "form-group has-error" : null;
            credentialsErrorMessage = this.validateCredentials().message;

            descriptionClassNames = this.validateDescription().hasError ?
                "form-group has-error" : null;
            descriptionErrorMessage = this.validateDescription().message;

            timezoneClassNames = this.validateTimezone().hasError ?
                "form-group has-error" : null;
            timezoneErrorMessage = this.validateTimezone().message;
        }

        return (
        <div role="form">
            <div className={nameClassNames}>
                <label htmlFor="provider-name">
                    Provider Name
                </label>
                <input type="text"
                    className="form-control"
                    value={providerName}
                    onChange={this.onNameChange}
                    onBlur={this.onNameBlur} />
                <span className="help-block">{nameErrorMessage}</span>
            </div>

            <div className={cloud_configClassNames}>
                <label htmlFor="provider-cloud_config">
                    CloudConfig
                </label>
                <textarea type="text"
                    className="form-control"
                    placeholder='Expects a JSON object - format: {"deploy":{}, "network": {}, "user": {}}'
                    rows="7"
                    value={this.state.providerCloudConfig}
                    onChange={this.onCloudConfigChange} />
                <span className="help-block">{cloud_configErrorMessage}</span>
            </div>

            <div className={credentialsClassNames}>
                <label htmlFor="provider-credentials">
                    Credentials
                </label>
                <textarea type="text"
                    className="form-control"
                    placeholder='Expects a JSON array - format: [{"key":"key", "value":"username"}'
                    rows="7"
                    value={this.state.providerCredentials}
                    onChange={this.onCredentialsChange} />
                <span className="help-block">{credentialsErrorMessage}</span>
            </div>

            <div className={descriptionClassNames}>
                <label htmlFor="provider-description">
                    Description
                </label>
                <textarea type="text"
                    className="form-control"
                    rows="7"
                    value={this.state.providerDescription}
                    onChange={this.onDescriptionChange} />
                <span className="help-block">{descriptionErrorMessage}</span>
            </div>

            <div className={timezoneClassNames}>
                <label htmlFor="provider-timezone">
                    Provider timezoneName
                </label>
                <input type="text"
                    className="form-control"
                    value={this.state.providerTimezone}
                    onChange={this.onTimezoneChange}
                />
                <span className="help-block">{timezoneErrorMessage}</span>
            </div>

            <div className={'form-group'}>
                <label htmlFor="provider-is_public">
                    Public Provider
                </label>
                <ToggleButton
                    id="provider-is_public"
                    isEnabled={this.state.providerIsPublic}
                    onToggle={this.onIsPublicChange}
                />
            </div>

            <div className={'form-group'}>
                <label htmlFor="provider-is_active">
                    Active Provider
                </label>
                <ToggleButton
                    id="provider-is_active"
                    isEnabled={this.state.providerIsActive}
                    onToggle={this.onIsActiveChange}
                />
            </div>

            <div className={'form-group'}>
                <label htmlFor="provider-allow-imaging">
                    Automatic Imaging
                </label>
                <ToggleButton
                    id="provider-allow-imaging"
                    isEnabled={this.state.providerAllowAutoImaging}
                    onToggle={this.onImagingChange}
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
