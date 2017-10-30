import React from "react";
import Backbone from "backbone";
import context from "context";
import subscribe from "utilities/subscribe";
import SelectMenu from "components/common/ui/SelectMenu";
import RaisedButton from "material-ui/RaisedButton";
import featureFlags from "utilities/featureFlags";

const EditDetails = React.createClass({
    displayName: "EditDetails",

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onCancel: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        let { GroupStore } = this.props.subscriptions;
        var project = this.props.project;

        var group_id = project.get("owner").id,
            group = GroupStore.get(group_id);
        return {
            name: project.get("name"),
            description: project.get("description"),
            groupOwner: group
        }
    },

    isSubmittable: function() {
        var hasName = !!this.state.name.trim();
        var hasDescription = !!this.state.description.trim();
        return hasName && hasDescription;
    },

    handleCancel: function() {
        this.props.onCancel();
    },

    handleSave: function(description) {
        let owner = featureFlags.hasProjectSharing() ?
                    this.state.groupOwner :
                    context.profile.get('username');

        this.props.onSave({
            name: this.state.name,
            description: this.state.description,
            owner
        });
    },

    handleNameChange: function(e) {
        var text = e.target.value;
        this.setState({
            name: text
        });
    },

    handleDescriptionChange: function(e) {
        var text = e.target.value;
        this.setState({
            description: text
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
    onGroupChange: function(group) {
        this.setState({
            groupOwner: group,
        });
    },


    // ------
    // Render
    // ------

    getMemberNames: function(group) {
        if(!group) {
            return "";
        }
        let user_list = group.get('users'),
            username_list = user_list.map(function(g) {return g.username});

        return username_list.join(", ");
    },
    renderVisibility: function() {
        if (!featureFlags.hasProjectSharing()) {
            return;
        }

        let projectTip;
        if (!this.state.groupOwner) {
            projectTip = "Select a Group";
        } else if (this.state.groupOwner.get('users').length == 1) {
            projectTip = "Private Project";
        } else {
            let projectUsernameList = this.getMemberNames(this.state.groupOwner);
            projectTip = "Share this Project with Users: " + projectUsernameList;
        }
        var project = this.props.project;
        let { GroupStore } = this.props.subscriptions;

        let current_user = context.profile.get('username');
        let groupList = GroupStore.getAll();
        if(!groupList) {
            return (<div className="loading"></div>);
        }
        if(project.hasSharedResources(current_user) ) {
            return (<div className="alert alert-info">
                    {"Uh-oh! It looks like you have shared resources in this project. We don't support changing a projects visibility if it contains shared resources in them."}
                    {"Before you can change this projects visibility, you first need to either DELETE all shared resources in this project or MOVE them into another project."}
                    {"Once there are no shared resources left in the project, you'll be able to change its visibility."}
                    </div>);
        }
        return (
            <div className="project-info-segment row">
                <h4 className="t-body-2 col-md-3">Visibility</h4>
                <SelectMenu current={this.state.groupOwner}
                    placeholder={"Select a Private/Shared Group"}
                    list={groupList}
                    optionName={g => this.mapGroupOptions(g)}
                    onSelect={this.onGroupChange} />
                <p className="t-caption" style={{ display: "block" }}>
                   {projectTip}
                </p>
            </div>
        );
    },
    render: function() {
        var project = this.props.project;

        return (
        <div className="edit-details">
            <div className="project-info-segment row" style={{ marginTop: "62px" }}>
                <h4 className="t-body-2 col-md-3">Name</h4>
                <input type="text" defaultValue={this.state.name} onKeyUp={this.handleNameChange} />
            </div>
            <div className="project-info-segment row">
                <h4 className="t-body-2 col-md-3">Created</h4>
                <p className="col-md-9">
                    {project.get("start_date").format("MMMM Do, YYYY hh:mm a")}
                </p>
            </div>
            <div className="project-info-segment row">
                <h4 className="t-body-2 col-md-3">Description</h4>
                <textarea type="text" defaultValue={this.state.description} onKeyUp={this.handleDescriptionChange} />
            </div>
            {this.renderVisibility()}
            <div className="buttons">
                <RaisedButton
                    style={{ marginRight: "10px" }}
                    className="cancel-button"
                    onTouchTap={this.handleCancel}
                    label="Cancel"
                />
                <RaisedButton
                    primary
                    className="save-button"
                    onTouchTap={this.handleSave}
                    disabled={!this.isSubmittable()}
                    label="Save"
                />
            </div>
        </div>
        );
    }
});

export default subscribe(EditDetails, ["GroupStore"]);
