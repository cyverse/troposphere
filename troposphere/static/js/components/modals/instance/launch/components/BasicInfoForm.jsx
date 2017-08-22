import React from "react";
import ReactDOM from "react-dom";
import Backbone from "backbone";
import context from "context";
import featureFlags from "utilities/featureFlags";
import SelectMenu from "components/common/ui/SelectMenu";

export default React.createClass({
    propTypes: {
        projectList: React.PropTypes.instanceOf(Backbone.Collection),
        imageVersion: React.PropTypes.instanceOf(Backbone.Model),
        imageVersionList: React.PropTypes.instanceOf(Backbone.Collection),
        project: React.PropTypes.instanceOf(Backbone.Model),
        image: React.PropTypes.instanceOf(Backbone.Model),
        instanceName: React.PropTypes.string,
        onNameChange: React.PropTypes.func,
        onVersionChange: React.PropTypes.func,
        onProjectChange: React.PropTypes.func
    },

    componentDidMount: function() {
        // TODO: Once we have current version of React I believe we ca just do:
        // this.refs.nameInput.select();
        ReactDOM.findDOMNode(this.refs.nameInput).select();
    },

    nameError() {
        const { instanceName } = this.props;

        function invalidName() {
            return /\.\d+$/gm.test(instanceName);
        }

        function missingName() {
            return !instanceName;
        }

        if (invalidName()) return "invalid";
        if (missingName()) return "missing";
    },

    getMemberNames: function(project) {
        if(project == null) {
            return "";
        }
        let user_list = project.get('users'),
            username_list = user_list.map(function(g) {return g.username});

        return username_list.join(", ");
    },

    render: function() {
        const {
            imageVersion,
            project,
            projectList,
            instanceName,
            showValidationErr,
            waitingOnLaunch
        } = this.props;
        let hasErrorClass;
        let errorMessage = null;

        let invalidMessage = `Invalid format, names can not end in a period followed by numbers. For example: "Instance Name.2222"`;

        let requiredMessage = "This field is required";

        if (showValidationErr) {
            switch (this.nameError()) {
                case "invalid":
                    errorMessage = invalidMessage;
                    hasErrorClass = "has-error";
                    break;
                case "missing":
                    errorMessage = requiredMessage;
                    hasErrorClass = "has-error";
                    break;
            }
        }
        let groupOwner, projectType;

        let projectUsernameList = this.getMemberNames(project);
        if(! featureFlags.hasProjectSharing()) {
            projectType = "";
        } else if (project != null) {
            groupOwner = project.get('owner');
            projectType = (groupOwner && groupOwner.name == context.profile.get('username')) ? "Private Project" : "Shared Project, Visible to Users: " + projectUsernameList;
        } else {
            projectType = "Select a project to continue.";
        }

        return (
        <form>
            <div className={"form-group " + hasErrorClass }>
                <label htmlFor="instanceName">
                    Instance Name
                </label>
                <input required
                    disabled={waitingOnLaunch}
                    type="Name"
                    className="form-control"
                    id="instanceName"
                    value={instanceName}
                    ref="nameInput"
                    onChange={this.props.onNameChange}
                    onBlur={this.props.onNameBlur} />
                <span className="help-block">{errorMessage}</span>
            </div>
            <div className="form-group">
                <label htmlFor="imageVersion">
                    Base Image Version
                </label>
                <SelectMenu current={imageVersion}
                    disabled={waitingOnLaunch}
                    list={this.props.imageVersionList}
                    optionName={item => item.get("name")}
                    onSelect={this.props.onVersionChange} />
            </div>
            <div className="form-group">
                <label htmlFor="project">
                    Project
                </label>
                <SelectMenu current={project}
                    disabled={waitingOnLaunch}
                    list={projectList}
                    optionName={item => item.get("name")}
                    onSelect={this.props.onProjectChange} />
                <p className="t-caption" style={{ display: "block" }}>
                   {projectType}
                </p>

            </div>
        </form>
        );
    }
});
