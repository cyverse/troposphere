define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    ChosenDropdownItem = require('./ChosenDropdownItem.react'),
    ChosenSelectedTag = require('./ChosenSelectedTag.react'),
    ChosenMixin = require('components/mixins/ChosenMixinExternal.react');

  return React.createClass({
    mixins: [ChosenMixin],

    propTypes: {
      tags: React.PropTypes.instanceOf(Backbone.Collection),
      activeModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onQueryChange: React.PropTypes.func.isRequired,
      onModelAdded: React.PropTypes.func.isRequired,
      onModelRemoved: React.PropTypes.func.isRequired
    },

    getNoResultsPhrase: function (query) {
      return 'No tags found matching "' + query + '". Press enter to create a new tag.';
    },

    getNoDataPhrase: function () {
      return "No tags exist";
    },

    getAllResultsAddedPhrase: function () {
      return "All tags have been added";
    },

    getAllAddedMatchingQueryPhrase: function (query) {
      return 'All tags matching "' + query + '" have been added'
    },

    renderModel: function (tag) {
      return (
        <ChosenDropdownItem
          key={tag.id}
          tag={tag}
          propertyName={'name'}
          onTagSelected={this.onModelAdded}
          />
      )
    },

    renderSelectedModel: function (tag) {
      return (
        <ChosenSelectedTag
          key={tag.id}
          tag={tag}
          propertyName={'name'}
          onRemoveTag={this.props.onModelRemoved}
          />
      )
    }

  })

});
