define(function (require) {

  var React = require('react'),
      Backbone = require('backbone');

  return React.createClass({
    display: "ChosenDropdownTag",

    propTypes: {
      tag: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onRemoveTag: React.PropTypes.func.isRequired,
      propertyName: React.PropTypes.string
    },

    getDefaultProps: function(){
      return {
        propertyName: "name"
      }
    },

    onRemoveTag: function(){
      this.props.onRemoveTag(this.props.tag);
    },

    render: function () {
      var tag = this.props.tag;

      return (
        <li className="search-choice">
          <span className="search-choice-close" onClick={this.onRemoveTag}>
          {tag.get(this.props.propertyName)} <i className="glyphicon glyphicon-remove"></i>
          </span>
        </li>
      );
    }

  });

});
