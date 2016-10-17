import React from "react";
import stores from "stores";
import SelectMenu from "components/common/ui/SelectMenu.react";
import { trackAction } from "../../utilities/userActivity";

export default React.createClass({
    displayName: "ProjectCreateView",

    getInitialState: function() {
        return {
            projectName: "",
            projectDescription: "",
            groupOwner: null,
            showValidation: false
        };
    },
    updateState: function() {
        this.setState({});
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

    validateOwner: function () {
        let owner = this.state.groupOwner;
        let hasError = false;
        let message = "";

        if (owner === "" || owner === null) {
            hasError = true;
            message = "This field is required";
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
        if (this.validateName().hasError || this.validateDescription().hasError || this.validateOwner().hasError ) {
            return false;
        }
        return true;
    },

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        if (this.isSubmittable()) {
            this.props.onConfirm(this.state.projectName.trim(),
                                 this.state.projectDescription.trim(),
                                 this.state.groupOwner);
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

    componentDidMount: function() {
        stores.GroupStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.GroupStore.removeChangeListener(this.updateState);
    },

    renderBody: function() {
        let projectName = this.state.projectName;
        let nameClassNames = "form-group";
        let nameErrorMessage = null;
        let descriptionClassNames = "form-group";
        let descriptionErrorMessage = null;
        let groupClassNames = "form-group";
        let groupErrorMessage = null;

        let groupList = stores.GroupStore.getAll();
        if(!groupList) {
            return (<div className="loading"></div>);
        }
        if (this.state.showValidation) {
            nameClassNames = this.validateName().hasError ?
                "form-group has-error" : null;
            nameErrorMessage = this.validateName().message;
            descriptionClassNames = this.validateDescription().hasError ?
                "form-group has-error" : null;
            descriptionErrorMessage = this.validateDescription().message;
            let validateOwner = this.validateOwner();
            groupErrorMessage = validateOwner.message;
            groupClassNames = validateOwner.hasError ?
                "form-group has-error" : null;
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
            <div className={groupClassNames}>
                <label htmlFor="groupOwner">
                    Group Owner
                </label>
                <SelectMenu current={this.state.groupOwner}
                    hintText={"Select a Group Owner"}
                    list={groupList}
                    optionName={g => g.get("name")}
                    onSelect={this.onGroupChange} />
                <span className="help-block">{groupErrorMessage}</span>
            </div>
        </div>
        );
    },

    onGroupChange: function(group) {
        this.setState({
            groupOwner: group,
        });
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
                <button id="cancelCreateProject"
                    type="button"
                    className="btn btn-default"
                    onClick={this.props.cancel}>
                    Cancel
                </button>
                <button id="submitCreateProject"
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
