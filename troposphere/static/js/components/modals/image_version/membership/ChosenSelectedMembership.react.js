define(function (require) {

  var React = require('react'),
      Backbone = require('backbone');

  return React.createClass({
    display: "ChosenDropdownMembership",

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
          <span>{membership.get(this.props.propertyName)}</span>
          <a className="search-choice-close" onClick={this.onRemoveMembership}></a>
        </li>
      );
    }

  });

});
