define(function (require) {

  var React = require('react'),
      Backbone = require('backbone');

  return React.createClass({
    display: "ChosenDropdownItem",

    propTypes: {
      user: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onRemoveUser: React.PropTypes.func.isRequired,
      propertyName: React.PropTypes.string
    },

    getDefaultProps: function(){
      return {
        propertyName: "name"
      }
    },

    onRemoveUser: function(){
      this.props.onRemoveUser(this.props.user);
    },

    render: function () {
      var user = this.props.user;

      return (
        <li className="search-choice">
          <span>{user.get(this.props.propertyName)}</span>
          <a className="search-choice-close" onClick={this.onRemoveUser}></a>
        </li>
      );
    }

  });

});
