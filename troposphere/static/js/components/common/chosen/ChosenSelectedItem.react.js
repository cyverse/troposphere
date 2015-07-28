define(function (require) {

  var React = require('react'),
      Backbone = require('backbone');

  return React.createClass({
    display: "ChosenDropdownItem",

    propTypes: {
      item: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onRemoveItem: React.PropTypes.func.isRequired,
      propertyName: React.PropTypes.string
    },

    getDefaultProps: function(){
      return {
        propertyName: "name"
      }
    },

    onRemoveItem: function(){
      this.props.onRemoveItem(this.props.item);
    },

    render: function () {
      var item = this.props.item;

      return (
        <li className="search-choice">
          <span>{item.get(this.props.propertyName)}</span>
          <a className="search-choice-close" onClick={this.onRemoveItem}></a>
        </li>
      );
    }

  });

});
