define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    ChosenDropdownItem = require('./ChosenDropdownItem.react'),
    ChosenSelectedTag = require('./ChosenSelectedTag.react'),
    ChosenMixin = require('components/mixins/ChosenMixinExternal.react');

  return React.createClass({
    mixins: [ChosenMixin],

    propTypes: {
      models: React.PropTypes.instanceOf(Backbone.Collection),
      activeModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onQueryChange: React.PropTypes.func.isRequired,
      onModelAdded: React.PropTypes.func.isRequired,
      onModelRemoved: React.PropTypes.func.isRequired
    },

    getNoResultsPhrase: function (query) {
      return 'No users found matching "' + query + '"';
    },

    getNoDataPhrase: function () {
      return "No users exist";
    },

    getAllResultsAddedPhrase: function () {
      return "All users have been added";
    },

    getAllAddedMatchingQueryPhrase: function (query) {
      return 'All users matching "' + query + '" have been added'
    },

    renderModel: function (tag) {
      return (
        <ChosenDropdownItem
          key={tag.id}
          tag={tag}
          propertyName={'username'}
          onTagSelected={this.onModelAdded}
          />
      )
    },

    renderSelectedModel: function (tag) {
      return (
        <ChosenSelectedTag
          key={tag.id}
          tag={tag}
          propertyName={'username'}
          onRemoveTag={this.props.onModelRemoved}
          />
      )
    }

  })

});
