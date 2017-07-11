import React from "react";
import Backbone from "backbone";
import subscribe from "utilities/subscribe";
import ChosenDropdown from "components/common/tags/UserMultiSelect";

const Users = React.createClass({
    displayName: "Users",

    propTypes: {
        onUserAdded: React.PropTypes.func.isRequired,
        onUserRemoved: React.PropTypes.func.isRequired,
        label: React.PropTypes.string,
        help: React.PropTypes.string.isRequired,
        users: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    getInitialState: function() {
        return {
            query: ""
        }
    },
    getDefaultProps() {
        return {
            label: "Users"
        }
    },

    onUserAdded: function(user) {
        this.setState({
            query: ""
        });
        this.props.onUserAdded(user);
    },

    onQueryChange: function(query) {
        this.setState({
            query: query
        });
    },

    render: function() {
        var users = this.props.users,
            query = this.state.query,
            allUsers;
        let { UserStore } = this.props.subscriptions;

        if (this.state.query) {
            allUsers = UserStore.fetchWhere({
                search: query
            });
        } else {
            allUsers = UserStore.getAll();
        }

        //if(!users) return <div className="loading"/>;

        return (
        <div className="form-group">
            <label htmlFor="tags" className="control-label">
                {this.props.label}
            </label>
            <div className="tagger_container">
                <div className="help-block">
                    {this.props.help}
                </div>
                <ChosenDropdown models={allUsers}
                    activeModels={users}
                    onModelAdded={this.onUserAdded}
                    onModelRemoved={this.props.onUserRemoved}
                    width={"100%"}
                    onQueryChange={this.onQueryChange}
                    placeholderText="Search by username..." />
            </div>
        </div>
        );
    }
});
export default subscribe(Users, ["UserStore"]);
