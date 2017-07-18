import React from "react";
import RaisedButton from "material-ui/RaisedButton";

import SelectMenu from "components/common/ui/SelectMenu";
import subscribe from "utilities/subscribe";
import featureFlags from "utilities/featureFlags";

import { trackAction } from "../../utilities/userActivity";


const ProjectCreateView = React.createClass({
    displayName: "ProjectCreateView",

    getInitialState: function() {

        return {
            projectName: "",
            projectDescription: "",
            groupOwner: null,
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
        if (this.validateName().hasError ||
            this.validateDescription().hasError ||
            (featureFlags.hasProjectSharing() && this.validateOwner().hasError) ) {
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

    mapGroupOptions: function(group) {
        let name = group.get('name'),
            groupUsers = group.get('users'),
            isPrivate = (groupUsers.length == 1),
            optionName;
        if(isPrivate) {
            optionName = name + " (Private)"
        } else {
            optionName = name + " (Shared)"
        }
        return optionName;
    },
    getMemberNames: function(group) {
        if(!group) {
            return "";
        }
        let user_list = group.get('users'),
            username_list = user_list.map(function(g) {return g.username});

        return username_list.join(", ");
    },
    renderBody: function() {
        let projectName = this.state.projectName;
        let nameClassNames = "form-group";
        let nameErrorMessage = null;
        let descriptionClassNames = "form-group";
        let descriptionErrorMessage = null;

        let { GroupStore } = this.props.subscriptions;

        let groupList = GroupStore.getAll();
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
        }

        return (
        <div role="form">
            <div className={nameClassNames}>
                <label htmlFor="project-name">
                    Project Name
                </label>
                <input type="text"
                    name="project-name"
                    id="project-name"
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
                    name="project-description"
                    id="project-description"
                    className="form-control"
                    rows="7"
                    value={this.state.projectDescription}
                    onChange={this.onDescriptionChange} />
                <span className="help-block">{descriptionErrorMessage}</span>
            </div>
            {this.renderProjectVisibility()}
        </div>
        );
    },
    renderProjectVisibility: function() {
        if(! featureFlags.hasProjectSharing()) {
            return;
        }

        let { GroupStore } = this.props.subscriptions;

        let groupList = GroupStore.getAll();
        if(!groupList) {
            return (<div className="loading"></div>);
        }
        let projectType;
        if(! featureFlags.hasProjectSharing()) {
            projectType = "";
        } else if (!this.state.groupOwner) {
            projectType = "Select a Group";
        } else if (this.state.groupOwner.get('users').length == 1) {
            projectType = "Private Project";
        } else {
            let projectUsernameList = this.getMemberNames(this.state.groupOwner);
            projectType = "Share this Project with Users: " + projectUsernameList;
        }

        let groupClassNames = "form-group";
        let groupErrorMessage = null;

        if (this.state.showValidation) {
            let validateOwner = this.validateOwner();
            groupClassNames = validateOwner.hasError ?
                "form-group has-error" : null;
            groupErrorMessage = validateOwner.message;
        }

        return (<div className={groupClassNames}>
                <label htmlFor="groupOwner">
                    Project Visibility
                </label>
                <SelectMenu current={this.state.groupOwner}
                    placeholder={"Select a Private/Shared Group"}
                    list={groupList}
                    optionName={g => this.mapGroupOptions(g)}
                    onSelect={this.onGroupChange} />
                <p className="t-caption" style={{ display: "block" }}>
                   {projectType}
                </p>
                <span className="help-block">{groupErrorMessage}</span>
            </div>);
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

export default subscribe(ProjectCreateView, ["GroupStore"]);
