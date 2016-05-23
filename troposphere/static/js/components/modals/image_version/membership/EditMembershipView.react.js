import React from 'react/addons';
import Backbone from 'backbone';
import MembershipMultiSelect from './MembershipMultiSelect.react';

let ENTER_KEY = 13;

export default React.createClass({
    displayName: "EditMembershipView",

    propTypes: {
      activeMemberships: React.PropTypes.instanceOf(Backbone.Collection),
      memberships: React.PropTypes.instanceOf(Backbone.Collection),
      onMembershipAdded: React.PropTypes.func.isRequired,
      onMembershipRemoved: React.PropTypes.func.isRequired,
      onCreateNewMembership: React.PropTypes.func,
      label: React.PropTypes.string.isRequired
    },

    getDefaultProps: function() {
      return {
        activeMemberships: new Backbone.Collection(),
        memberships: new Backbone.Collection()
      }
    },
    getInitialState: function(){
      return {
        isEditingMemberships: false,
        query: ""
      }
    },

    onQueryChange: function(query){
      this.setState({query: query});
    },
    render: function () {
      var query = this.state.query,
          link,
          membershipView,
          memberships = this.props.memberships;

      if(query){
        memberships = this.props.memberships.filter(function(membership){
          return membership.get('name').toLowerCase().indexOf(query) >= 0;
        });
        memberships = new Backbone.Collection(memberships);
      }

        membershipView = (
          <MembershipMultiSelect
            models={memberships}
            activeModels={this.props.activeMemberships}
            onModelAdded={this.props.onMembershipAdded}
            onModelRemoved={this.props.onMembershipRemoved}
            onQueryChange={this.onQueryChange}
            placeholderText="Search by user name..."
          />
        );

      return (
        <div className="resource-users">
          <h4 className='user-title'>{this.props.label}</h4>
          {membershipView}
        </div>
      );
    }
});
