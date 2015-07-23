define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      ChosenDropdownItem = require('./ChosenDropdownItem.react'),
      ChosenSelectedUser = require('./ChosenSelectedUser.react'),
      ChosenMixin = require('components/mixins/ChosenMixinExternal.react');

  return React.createClass({
    mixins: [ChosenMixin],

    propTypes: {
      users: React.PropTypes.instanceOf(Backbone.Collection),
      activeModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onQueryChange: React.PropTypes.func.isRequired,
      onModelAdded: React.PropTypes.func.isRequired,
      onModelRemoved: React.PropTypes.func.isRequired
    },

    getNoResultsPhrase: function(query){
      return 'No users found matching "' + query + '". Press enter to create a new user.';
    },

    getNoDataPhrase: function(){
      return "No users exist";
    },

    getAllResultsAddedPhrase: function(){
      return "All users have been added";
    },

    getAllAddedMatchingQueryPhrase: function(query){
      return 'All users matching "' + query + '" have been added'
    },

    renderModel: function(user){
      return (
        <ChosenDropdownItem
          key={user.id}
          user={user}
          propertyName={'username'}
          onUserSelected={this.onModelAdded}
        />
      )
    },

    renderSelectedModel: function(user){
      return (
        <ChosenSelectedUser
          key={user.id}
          user={user}
          propertyName={'name'}
          onRemoveUser={this.props.onModelRemoved}
        />
      )
    }

  })

});
