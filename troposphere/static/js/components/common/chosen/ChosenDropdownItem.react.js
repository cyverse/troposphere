import React from 'react';
import Backbone from 'backbone';
import classNames from 'classnames';

export default React.createClass({
    displayName: "ChosenDropdownItem",

    propTypes: {
      item: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onItemSelected: React.PropTypes.func.isRequired,
      propertyName: React.PropTypes.string
    },

    getDefaultProps: function(){
      return {
        propertyName: "name"
      }
    },

    getInitialState: function(){
      return {
        isMouseOver: false
      }
    },

    onMouseEnter: function(){
      this.setState({isMouseOver: true})
    },

    onMouseLeave: function(){
      this.setState({isMouseOver: false})
    },

    onItemSelected: function(){
      this.props.onItemSelected(this.props.item);
    },

    render: function () {
      var item = this.props.item,
          classes = classNames({
            'active-result': true,
            'highlighted': this.state.isMouseOver
          });

      return (
        <li className={classes}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onItemSelected}>
          {item.get(this.props.propertyName)}
        </li>
      );
    }

});
