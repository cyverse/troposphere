define(function (require) {

  var React = require('react'),
    Backbone = require('backbone');

  return React.createClass({
    display: "ChosenDropdownItem",

    propTypes: {
      tag: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onRemoveTag: React.PropTypes.func.isRequired,
      propertyName: React.PropTypes.string
    },

    getDefaultProps: function () {
      return {
        propertyName: "name"
      }
    },

    onRemoveTag: function () {
      this.props.onRemoveTag(this.props.tag);
    },

    render: function () {
      var tag = this.props.tag;

      return (
        <li className="search-choice">
          <span>{tag.get(this.props.propertyName)}</span>
          <a className="search-choice-close" onClick={this.onRemoveTag}></a>
        </li>
      );
    }

  });

});
