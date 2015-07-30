define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      ChosenDropdownMembership = require('./ChosenDropdownMembership.react'),
      ChosenSelectedMembership = require('./ChosenSelectedMembership.react'),
      ChosenMixin = require('components/mixins/ChosenMixinExternal.react');

  return React.createClass({
    mixins: [ChosenMixin],

    propTypes: {
      memberships: React.PropTypes.instanceOf(Backbone.Collection),
      activeModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onQueryChange: React.PropTypes.func.isRequired,
      onModelAdded: React.PropTypes.func.isRequired,
      onModelRemoved: React.PropTypes.func.isRequired
    },

    getNoResultsPhrase: function(query){
      return 'No memberships found matching "' + query + '". Press enter to create a new membership.';
    },

    getNoDataPhrase: function(){
      return "No memberships exist";
    },

    getAllResultsAddedPhrase: function(){
      return "All memberships have been added";
    },

    getAllAddedMatchingQueryPhrase: function(query){
      return 'All memberships matching "' + query + '" have been added'
    },

    renderModel: function(membership){
      return (
        <ChosenDropdownMembership
          key={membership.id}
          membership={membership}
          propertyName={'name'}
          onMembershipSelected={this.onModelAdded}
        />
      )
    },

    renderSelectedModel: function(membership){
      return (
        <ChosenSelectedMembership
          key={membership.id}
          membership={membership}
          propertyName={'name'}
          onRemoveMembership={this.props.onModelRemoved}
        />
      )
    },
    render: function() {
      return this.renderChosenSearchSelect();
    }


  })

});
