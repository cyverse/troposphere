import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import Backbone from "backbone";
import Visibility from "../components/Visibility";
import Users from "components/common/Users";

export default React.createClass({
    displayName: "ImageWizard-VisibilityStep",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getDefaultProps: function() {
        return {
            visibility: "public",
            imageUsers: new Backbone.Collection()
        };
    },

    getInitialState: function() {
        return {
            visibility: this.props.visibility,
            users: this.props.users,
            imageUsers: this.props.imageUsers || new Backbone.Collection()
        }
    },

    isSubmittable: function() {
        var hasVisibility = !!this.state.visibility;
        return hasVisibility;
    },

    onPrevious: function() {
        this.props.onPrevious({
            visibility: this.state.visibility,
            imageUsers: this.state.imageUsers
        });
    },

    onNext: function() {
        this.props.onNext({
            visibility: this.state.visibility,
            imageUsers: this.state.imageUsers
        });
    },

    onSubmit: function() {
        this.props.onSubmit({
            visibility: this.state.visibility,
            imageUsers: this.state.imageUsers
        });
    },

    onVisibilityChange: function(newVisibility) {
        // when we change visibility we should reset the user list to empty
        this.setState({
            visibility: newVisibility,
            imageUsers: new Backbone.Collection()
        });
    },

    onAddUser: function(user) {
        var imageUsers = this.state.imageUsers;
        imageUsers.add(user);
        this.setState({
            imageUsers: imageUsers
        });
    },

    onRemoveUser: function(user) {
        var imageUsers = this.state.imageUsers;
        imageUsers.remove(user);
        this.setState({
            imageUsers: imageUsers
        })
    },

    renderUserList: function() {
        let helpLabel = "Please include users that should be able to launch this image.";
        if (this.state.visibility === "select") {
            return (
            <Users users={this.state.imageUsers} onUserAdded={this.onAddUser} onUserRemoved={this.onRemoveUser} help={helpLabel} />
            )
        }
    },

    renderBody: function() {
        return (
        <div>
            <Visibility instance={this.props.instance} value={this.state.visibility} onChange={this.onVisibilityChange} />
            {this.renderUserList()}
        </div>
        );
    },

    render: function() {
        return (
        <div>
            <div className="modal-body">
                {this.renderBody()}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.onPrevious}>
                    <span className="glyphicon glyphicon-chevron-left"></span> Back
                </button>
                <RaisedButton
                    secondary
                    style={{ marginRight: "10px" }}
                    onTouchTap={this.onNext}
                    disabled={!this.isSubmittable()}
                    label="Advanced Options"
                />
                <RaisedButton
                    primary
                    onTouchTap={this.onSubmit}
                    disabled={!this.isSubmittable()}
                    label="Submit"
                />
            </div>
        </div>
        );
    }
});
