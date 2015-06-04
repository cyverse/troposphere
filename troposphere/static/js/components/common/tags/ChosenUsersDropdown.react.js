define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      ChosenDropdownItem = require('./ChosenDropdownItem.react'),
      ChosenSelectedTag = require('./ChosenSelectedTag.react'),
      ChosenMixin = require('components/mixins/ChosenMixin.react');

  return React.createClass({
    mixins: [ChosenMixin],

    propTypes: {
      tags: React.PropTypes.instanceOf(Backbone.Collection),
      activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onQueryChange: React.PropTypes.func.isRequired,
      onModelAdded: React.PropTypes.func.isRequired,
      onModelRemoved: React.PropTypes.func.isRequired
    },

    renderTag: function(tag){
      return (
        <ChosenDropdownItem
          key={tag.id}
          tag={tag}
          propertyName={'username'}
          onTagSelected={this.onModelAdded}
        />
      )
    },

    renderSelectedTag: function(tag){
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
