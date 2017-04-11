import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import { trackAction } from "../../utilities/userActivity";

export default React.createClass({
    displayName: "ProjectCreateView",

    getInitialState: function() {
        return {
            projectName: "",
            projectDescription: "",
            showValidation: false
        };
    },

    validateName: function () {
        let name = this.state.projectName;
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

    validateDescription: function () {
        let description = this.state.projectDescription;
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

    isSubmittable: function () {
        if (!this.validateName().hasError && !this.validateDescription().hasError) {
            return true;
        }

        return false;
    },

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        if (this.isSubmittable()) {
            this.props.onConfirm(this.state.projectName.trim(),
                                 this.state.projectDescription.trim());
        }
        trackAction("created-project", {});
        this.setState({
            showValidation: true
        });
    },

    // todo: I don't think there's a reason to update state unless
    // there's a risk of the component being re-rendered by the parent.
    // Should probably verify this behavior, but for now, we play it safe.
    onNameChange: function(e) {
        this.setState({
            projectName: e.target.value
        });
    },

    onNameBlur: function () {
        let projectName = this.state.projectName.trim();
        this.setState({
            projectName
        });
    },

    onDescriptionChange: function(e) {
        this.setState({
            projectDescription: e.target.value
        });
    },

    renderBody: function() {
        let projectName = this.state.projectName;
        let nameClassNames = "form-group";
        let nameErrorMessage = null;
        let descriptionClassNames = "form-group";
        let descriptionErrorMessage = null;

        if (this.state.showValidation) {
            nameClassNames = this.validateName().hasError ?
                "form-group has-error" : null;
            nameErrorMessage = this.validateName().message;
            descriptionClassNames = this.validateDescription().hasError ?
                "form-group has-error" : null;
            descriptionErrorMessage = this.validateDescription().message;
        }

        return (
        <div role="form">
            <div className={nameClassNames}>
                <label htmlFor="project-name">
                    Project Name
                </label>
                <input type="text"
                    className="form-control"
                    value={projectName}
                    onChange={this.onNameChange}
                    onBlur={this.onNameBlur} />
                <span className="help-block">{nameErrorMessage}</span>
            </div>
            <div className={descriptionClassNames}>
                <label htmlFor="project-description">
                    Description
                </label>
                <textarea type="text"
                    className="form-control"
                    rows="7"
                    value={this.state.projectDescription}
                    onChange={this.onDescriptionChange} />
                <span className="help-block">{descriptionErrorMessage}</span>
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
                <RaisedButton
                    id="cancelCreateProject"
                    style={{ marginRight: "10px" }}
                    onTouchTap={this.props.cancel}
                    label="Cancel"
                />
                <RaisedButton
                    primary
                    id="submitCreateProject"
                    onTouchTap={this.confirm}
                    disabled={!isSubmittable}
                    label="Create"
                />
            </div>
        </div>
        );
    }
});
