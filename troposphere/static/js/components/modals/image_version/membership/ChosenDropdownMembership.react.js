import React from 'react';
import Backbone from 'backbone';
import classNames from 'classnames';


export default React.createClass({
    displayName: "ChosenDropdownMembership",

    propTypes: {
      membership: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onMembershipSelected: React.PropTypes.func.isRequired,
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

    onMembershipSelected: function(){
      this.props.onMembershipSelected(this.props.membership);
    },

    render: function () {
      var membership = this.props.membership,
          classes = classNames({
            'active-result': true,
            'highlighted': this.state.isMouseOver
          });

      return (
        <li className={classes}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onMembershipSelected}>
          {membership.get(this.props.propertyName)}
        </li>
      );
    }
});
