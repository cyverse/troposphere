define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      MultiFormMixin = require('components/mixins/MultiFormMixin.react');

  return React.createClass({
    mixins: [MultiFormMixin],

    propTypes: {
      memberships: React.PropTypes.instanceOf(Backbone.Collection),
      activeModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      renderCreateForm: React.PropTypes.func.isRequired,
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
        <ChosenDropdownItem
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
    }

  })

});
