define(function (require) {

  var React = require('react'),
      Backbone = require('backbone');

  return React.createClass({
    display: "ChosenDropdownItem",

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
          cx = React.addons.classSet,
          classes = cx({
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

});
