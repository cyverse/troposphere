import React from "react";
import Backbone from "backbone";


export default React.createClass({
    displayName: "ChosenDropdownItem",

    propTypes: {
        item: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onRemoveItem: React.PropTypes.func.isRequired,
        propertyCB: React.PropTypes.func,
        propertyName: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            propertyName: "name"
        }
    },

    onRemoveItem: function() {
        this.props.onRemoveItem(this.props.item);
    },

    render: function() {
        var item = this.props.item;
        let propertyName;
        if(this.props.propertyCB) {
            propertyName = this.props.propertyCB(item);
        } else {
            propertyName = item.get(this.props.propertyName);
        }
        return (
        <li className="search-choice">
            <span className="search-choice-close" onClick={this.onRemoveItem}>{propertyName} <i className="glyphicon glyphicon-remove"></i></span>
        </li>
        );
    }
});
