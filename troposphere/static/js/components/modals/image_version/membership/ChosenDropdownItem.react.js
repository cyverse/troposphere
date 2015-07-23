define(function (require) {

  var React = require('react'),
      Backbone = require('backbone');

  return React.createClass({
    display: "ChosenDropdownItem",

    propTypes: {
      user: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onUserSelected: React.PropTypes.func.isRequired,
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

    onUserSelected: function(){
      this.props.onUserSelected(this.props.user);
    },

    render: function () {
      var user = this.props.user,
          cx = React.addons.classSet,
          classes = cx({
            'active-result': true,
            'highlighted': this.state.isMouseOver
          });

      return (
        <li className={classes}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onUserSelected}>
          {user.get(this.props.propertyName)}
        </li>
      );
    }

  });

});
