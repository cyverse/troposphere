import React from 'react';
import Backbone from 'backbone';
import ChosenDropdownTag from './ChosenDropdownTag.react';
import ChosenSelectedTag from './ChosenSelectedTag.react';
import ChosenMixin from 'components/mixins/ChosenMixinExternal.react';

export default React.createClass({
    displayName: "UserMultiSelect",

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
        <ChosenDropdownTag
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
    },
    render: function() {
      return this.renderChosenSearchSelect();
    }
})
