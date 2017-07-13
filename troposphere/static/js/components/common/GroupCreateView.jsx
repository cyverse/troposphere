import React from "react";
import Backbone from "backbone";
import subscribe from "utilities/subscribe";
import UserCollection from "collections/UserCollection";
import Users from "./Users";

const GroupCreateView = React.createClass({
    displayName: "GroupCreateView",

    propTypes: {
        group: React.PropTypes.instanceOf(Backbone.Model)
    },
    getDefaultProps: function() {
        return {
            group: new Backbone.Model(),
        }
    },
    getInitialState: function() {
        let name = this.props.group.get('name') || "";
        let groupUsers, groupLeaders;
        if(this.props.group.get('users')) {
            let users = this.props.group.get('users');
            groupUsers = new UserCollection(users);
        } else {
            groupUsers = new Backbone.Collection();
        }
        if(this.props.group.get('leaders')) {
            let leaders = this.props.group.get('leaders');
            groupLeaders = new UserCollection(leaders);
        } else {
            groupLeaders = new Backbone.Collection();
        }
        return {
            groupName: name,
            groupUsers,
            groupLeaders,
            showValidation: false
        };
    },

    onAddLeader: function(user) {
        var groupLeaders = this.state.groupLeaders;
        groupLeaders.add(user);
        this.setState({
            groupLeaders: groupLeaders
        });
    },

    onRemoveLeader: function(user) {
        var groupLeaders = this.state.groupLeaders;
        groupLeaders.remove(user);
        this.setState({
            groupLeaders: groupLeaders
        })
    },
    renderLeaderList: function() {
        let helpLabel = "Include users to be leaders for the group. Leaders have full-control over the group and their resources. Every leader is a user.";
        return (
            <Users label="(Optional) Leaders" users={this.state.groupLeaders} onUserAdded={this.onAddLeader} onUserRemoved={this.onRemoveLeader} help={helpLabel} />
        );
    },

    onAddUser: function(user) {
        var groupUsers = this.state.groupUsers;
        groupUsers.add(user);
        this.setState({
            groupUsers: groupUsers
        });
    },

    onRemoveUser: function(user) {
        var groupUsers = this.state.groupUsers;
        groupUsers.remove(user);
        this.setState({
            groupUsers: groupUsers
        })
    },

    renderIdentityList: function() {
        let { IdentityStore } = this.props.subscriptions,
            identitiesForGroup = IdentityStore.getIdentitiesForGroup(this.props.group);

        let identitySelection = (<div className="loading"/>);
        if(identitiesForGroup != null) {
            let identity_items = identitiesForGroup.map(function(identity) {
                return (
                    <li key={identity.id} >
                        {identity.get('key') + ", Provider: " + identity.get('provider').name}
                    </li>)
            });
            identitySelection = (
                <ul>
                    {identity_items}
                </ul>
            );
        }

        let noteLabel = "NOTE: For now, all identities will be shared in the group. In the future, we can allow the user (or the leader) to self-select the identities they would like to include in the group."
        let helpLabel = "These identities are part of the group and can be used to launch new resources.";
        return (
            <div className="">
                <label className="control-label">Identities</label>
                <div className="alert alert-info">{noteLabel}</div>
                <div className="help-block">{helpLabel}</div>
                {identitySelection}
            </div>
        );
    },

    renderUserList: function() {
        let helpLabel = "Include users that should be added to the group. Users in the group can share resources with each other.";
        return (
            <Users
                users={this.state.groupUsers}
                onUserAdded={this.onAddUser}
                onUserRemoved={this.onRemoveUser}
                help={helpLabel} />
        );
    },

    validateLeaders: function () {
        //TODO: Validate that usernames are accurate
        let hasError = false;
        let message = "";

        return {
            hasError,
            message
        }
    },
    validateUsersOrLeaders: function () {
        //TODO: Validate that usernames are accurate
        let hasError = false;
        let message = "";

        let users = this.state.groupUsers;
        if(users.length == 0) {
            hasError = true;
            message = "At least one user or leader is required";
        }
        return {
            hasError,
            message
        }
    },
    validateName: function () {
        let hasError = false;
        let message = "";

        let name = this.state.groupName;
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

    isSubmittable: function () {
        if (!this.validateName().hasError &&
            !this.validateUsersOrLeaders().hasError
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
            let group_post_data = {
                'name': this.state.groupName.trim(),
                'users': this.state.groupUsers.map(u => u.get('username')),
                'leaders': this.state.groupLeaders.map(u => u.get('username'))
            }
            this.props.onConfirm(group_post_data);
        }
        this.setState({
            showValidation: true
        });
    },

    // todo: I don't think there's a reason to update state unless
    // there's a risk of the component being re-rendered by the parent.
    // Should probably verify this behavior, but for now, we play it safe.
    onNameChange: function(e) {
        this.setState({
            groupName: e.target.value
        });
    },

    onNameBlur: function () {
        let groupName = this.state.groupName.trim();
        this.setState({
            groupName
        });
    },

    renderBody: function() {
        let groupName = this.state.groupName;
        let nameClassNames = "form-group";
        let nameErrorMessage = null;

        let usersClassNames = "form-group";
        let usersErrorMessage = null;

        let leadersClassNames = "form-group";
        let leadersErrorMessage = null;



        if (this.state.showValidation) {
            nameClassNames = this.validateName().hasError ?
                "form-group has-error" : null;
            nameErrorMessage = this.validateName().message;

            usersClassNames = this.validateUsersOrLeaders().hasError ?
                "form-group has-error" : null;
            usersErrorMessage = this.validateUsersOrLeaders().message;

            leadersClassNames = this.validateUsersOrLeaders().hasError ?
                "form-group has-error" : null;
            leadersErrorMessage = this.validateUsersOrLeaders().message;
        }

        return (
        <div role="form">
            <div className={nameClassNames}>
                <label htmlFor="group-name">
                    Group Name
                </label>
                <input type="text"
                    className="form-control"
                    value={groupName}
                    onChange={this.onNameChange}
                    onBlur={this.onNameBlur} />
                <span className="help-block">{nameErrorMessage}</span>
            </div>

            <div className={leadersClassNames}>
                {this.renderLeaderList()}
                <span className="help-block">{leadersErrorMessage}</span>
            </div>

            <div className={usersClassNames}>
                {this.renderUserList()}
                <span className="help-block">{usersErrorMessage}</span>
            </div>

            <div className="form-group">
                {this.renderIdentityList()}
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
                <button id="cancelCreateGroup"
                    type="button"
                    className="btn btn-default"
                    onClick={this.props.cancel}>
                    Cancel
                </button>
                <button id="submitCreateGroup"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.confirm}
                    disabled={!isSubmittable}>
                    Save
                </button>
            </div>
        </div>
        );
    }
});
export default subscribe(GroupCreateView, ["IdentityStore"]);
