import React from "react";
import actions from "actions";
import RaisedButton from "material-ui/RaisedButton";
import Backbone from "backbone";
import Visibility from "../components/Visibility";
import EditAccessView from "components/images/detail/access_list/EditAccessView";
import Users from "components/common/Users";

export default React.createClass({
    displayName: "ImageWizard-VisibilityStep",

    propTypes: {
        allPatterns: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getDefaultProps: function() {
        return {
            visibility: "public",
            imageUsers: new Backbone.Collection()
        };
    },

    getInitialState: function() {
        // let parentImage = stores.ImageStore.get(instance.get('image').uuid);
        //Note: An improvement here would be showing a `loader` until ImageStore.get() returns
        // and then bootstrapping `activeAccessList` with `image.get('access_list')` rather than
        // an empty Backbone Collection. Since this is a new feature, everything will be empty,
        // so we can likely skip this improvement for a future refactor.
        let activeAccessList = this.props.activeAccessList;
        if (!activeAccessList) {
            activeAccessList = new Backbone.Collection();
        }

        return {
            activeAccessList,
            visibility: this.props.visibility,
            users: this.props.users,
            imageUsers: this.props.imageUsers || new Backbone.Collection()
        }
    },

    /** Callbacks */
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
            activeAccessList: this.state.activeAccessList,
            imageUsers: this.state.imageUsers
        });
    },

    onSubmit: function() {
        this.props.onSubmit({
            visibility: this.state.visibility,
            activeAccessList: this.state.activeAccessList,
            imageUsers: this.state.imageUsers
        });
    },

    onVisibilityChange: function(newVisibility) {
        // reset visibility will also reset the lists to empty
        this.setState({
            visibility: newVisibility,
            imageUsers: new Backbone.Collection(),
            activeAccessList: new Backbone.Collection()
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
    onPatternCreated: function(patternObj) {
        let params = {
            pattern: patternObj.pattern,
            type: (patternObj.type == "E-Mail") ? 'Email': 'Username',
            allowAccess: patternObj.allowAccess,
            // Add a success callback to add new pattern to list
            success: this.onAccessAdded
        };
        actions.PatternMatchActions.create(params);
    },

    onAccessAdded: function(pattern_match) {
        let activeAccessList = this.state.activeAccessList
        activeAccessList.add(pattern_match)
        this.setState({
            activeAccessList: activeAccessList
        });
    },
    onAccessRemoved: function(pattern_match) {
        let activeAccessList = this.state.activeAccessList
        activeAccessList.remove(pattern_match)
        this.setState({
            activeAccessList: activeAccessList
        });
    },

    /** Rendering **/
    renderUserList: function() {
        let helpLabel = "Please include users that should be able to launch this image.";
        if (this.state.visibility === "select") {
            return (
            <Users users={this.state.imageUsers} onUserAdded={this.onAddUser} onUserRemoved={this.onRemoveUser} help={helpLabel} />
            )
        }
    },

    renderAccessList: function() {
        if (this.state.visibility === "select") {
            if(this.props.allPatterns == null) {
                return (<div className="loading" />);
            }
            return (
            <div>
                <hr />
                <EditAccessView
                    allPatterns={this.props.allPatterns}
                    activeAccessList={this.state.activeAccessList}
                    onAccessAdded={this.onAccessAdded}
                    onAccessRemoved={this.onAccessRemoved}
                    onCreateNewPattern={this.onPatternCreated}
                />
            </div>
            );
        }
    },

    renderBody: function() {
        return (
        <div>
            <Visibility instance={this.props.instance} value={this.state.visibility} onChange={this.onVisibilityChange} />
            {this.renderUserList()}
            {this.renderAccessList()}
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
