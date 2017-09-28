import React from "react";
import Backbone from "backbone";
import MembershipMultiSelect from "./MembershipMultiSelect";
import subscribe from "utilities/subscribe";

const EditMembershipView = React.createClass({
    displayName: "EditMembershipView",

    propTypes: {
        activeMemberships: React.PropTypes.instanceOf(Backbone.Collection),
        onMembershipAdded: React.PropTypes.func.isRequired,
        onMembershipRemoved: React.PropTypes.func.isRequired,
        label: React.PropTypes.string.isRequired
    },

    getDefaultProps: function() {
        return {
            activeMemberships: new Backbone.Collection(),
        }
    },
    getInitialState: function() {
        return {
            isEditingMemberships: false,
            query: ""
        }
    },

    onQueryChange: function(query) {
        this.setState({
            query: query
        });
    },
    render: function() {
        var query = this.state.query,
            membershipView,
            memberships,
            { GroupStore} = this.props.subscriptions;

        if (query) {
            memberships = GroupStore.fetchWhere({
                search: query
            });
        } else {
            memberships = GroupStore.fetchWhere({
                search: ""
            });
        }

        membershipView = (
            <MembershipMultiSelect models={memberships}
                activeModels={this.props.activeMemberships}
                onModelAdded={this.props.onMembershipAdded}
                onModelRemoved={this.props.onMembershipRemoved}
                onQueryChange={this.onQueryChange}
                placeholderText="Search by user name..." />
        );

        return (
        <div className="resource-users">
            <h4 className="user-title">{this.props.label}</h4>
            {membershipView}
        </div>
        );
    }
});
export default subscribe(EditMembershipView, ["GroupStore"]);
