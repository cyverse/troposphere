import React from "react";
import ReactDOM from "react-dom";
import Backbone from "backbone";
import context from "context";
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

    getMemberNames: function(project) {
        if(project == null) {
            return "";
        }
        let user_list = project.get('users'),
            username_list = user_list.map(function(g) {return g.username});

        return username_list.join(", ");
    },
    render: function() {
        let imageVersion = this.props.imageVersion;
        let project = this.props.project;
        let projectList = this.props.projectList;
        let instanceName = this.props.instanceName;
        let instanceNameClasses = "form-group";
        let errorMessage = null;
        let groupOwner, projectType;
        if (this.props.showValidationErr) {
            errorMessage = instanceName == "" ? "This field is required" : null;
            instanceNameClasses = instanceName == "" ? "form-group has-error" : "form-group";
        }
        let projectUsernameList = this.getMemberNames(project);
        if (project != null) {
            groupOwner = project.get('owner');
            projectType = (groupOwner && groupOwner.name == context.profile.get('username')) ? "Private Project" : "Project shared with Users: " + projectUsernameList;
        } else {
            projectType = "Select a project to continue.";
        }

        return (
        <form>
            <div className={instanceNameClasses}>
                <label htmlFor="instanceName">
                    Instance Name
                </label>
                <input required
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
                    list={this.props.imageVersionList}
                    optionName={item => item.get("name")}
                    onSelect={this.props.onVersionChange} />
            </div>
            <div className="form-group">
                <label htmlFor="project">
                    Project
                </label>
                <SelectMenu current={project}
                    list={projectList}
                    optionName={item => item.get("name")}
                    onSelect={this.props.onProjectChange} />
                <p className="t-caption" style={{ display: "block" }}>
                   {projectType}
                </p>

            </div>
        </form>
        );
    },
});
