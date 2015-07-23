define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      MembershipMultiSelect = require('./MembershipMultiSelect.react');

  var ENTER_KEY = 13;

  return React.createClass({
    display: "EditMembershipView",
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


    onEnterKeyPressed: function(e){
      var text = e.target.value;
      if (e.which === ENTER_KEY && text.trim()) {
        this.props.onCreateNewMembership(text);
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

        var updateLink = (
          <a className="toggle-editing-link" href="#" onClick={this.onDoneEditingMemberships}>Save Changes</a>
        );

        membershipView = (
          <MembershipMultiSelect
            models={memberships}
            activeModels={this.props.activeMemberships}
            onModelAdded={this.props.onMembershipAdded}
            onModelRemoved={this.props.onMembershipRemoved}
            onEnterKeyPressed={this.onEnterKeyPressed}
            onQueryChange={this.onQueryChange}
            placeholderText="Search by user name..."
          />
        );

      return (
        <div className="resource-users">
          <span className='user-title'>{this.props.label}</span>
          {updateLink}
          {membershipView}
        </div>
      );
    }

  });

});
