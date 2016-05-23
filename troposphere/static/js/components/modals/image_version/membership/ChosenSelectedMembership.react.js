import React from 'react';
import Backbone from 'backbone';

export default React.createClass({
    displayName: "ChosenSelectedMembership",

    propTypes: {
      membership: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onRemoveMembership: React.PropTypes.func.isRequired,
      propertyName: React.PropTypes.string
    },

    getDefaultProps: function(){
      return {
        propertyName: "name"
      }
    },

    onRemoveMembership: function(){
      this.props.onRemoveMembership(this.props.membership);
    },

    render: function () {
      var membership = this.props.membership;

      return (
        <li className="search-choice">
          <span className="search-choice-close" onClick={this.onRemoveMembership}>
          {membership.get(this.props.propertyName)} <i className="glyphicon glyphicon-remove"></i>
          </span>
        </li>
      );
    }
});
