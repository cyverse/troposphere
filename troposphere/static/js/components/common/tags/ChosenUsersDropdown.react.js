define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      ChosenDropdownItem = require('./ChosenDropdownItem.react'),
      ChosenSelectedTag = require('./ChosenSelectedTag.react'),
      ChosenMixin = require('components/mixins/ChosenMixin.react');

  return React.createClass({
    mixins: [ChosenMixin],

    propTypes: {
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onTagAdded: React.PropTypes.func.isRequired,
      onTagRemoved: React.PropTypes.func.isRequired
    },

    renderTag: function(tag){
      return (
        <ChosenDropdownItem
          key={tag.id}
          tag={tag}
          propertyName={'username'}
          onTagSelected={this.props.onTagAdded}
        />
      )
    },

    renderSelectedTag: function(tag){
      return (
        <ChosenSelectedTag
          key={tag.id}
          tag={tag}
          propertyName={'username'}
          onRemoveTag={this.props.onTagRemoved}
        />
      )
    }

  })

});
