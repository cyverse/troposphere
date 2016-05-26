import React from 'react';
import Backbone from 'backbone';


export default React.createClass({
    displayName: "ChosenDropdownItem",

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
          <span className="search-choice-close" onClick={this.onRemoveItem}>
            {item.get(this.props.propertyName)} <i className="glyphicon glyphicon-remove"></i>
         </span>
        </li>
      );
    }
});
