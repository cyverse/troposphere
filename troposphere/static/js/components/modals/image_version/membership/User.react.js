define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      Router = require('react-router'),
      //Router = require('router'),
      // plugin: required but not used directly
      bootstrap = require('bootstrap');

  return React.createClass({
    display: "User",

    propTypes: {
      user: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      renderLinks: React.PropTypes.bool
    },

    getDefaultProps: function(){
      return {
        renderLinks: true
      }
    },

    componentDidMount: function(){
      var el = this.getDOMNode(),
          $el = $(el),
          user = this.props.user;

      $el.tooltip({
        title: user.get('description')
      });
    },

    onClick: function(){
      Router.getInstance().transitionTo("search", {}, {q: this.props.user.get('name')});
    },

    render: function () {
      var user = this.props.user,
          userName = user.get('name'),
          link;

      if(this.props.renderLinks){
        link = (
          <Router.Link to="search" query={{q: userName}}>
            {userName}
          </Router.Link>
        );
      }else{
        link = (
          <a href="javascript:void(0)">{userName}</a>
        )
      }

      return (
        <li className="user">
          {link}
        </li>
      );

    }

  });

});
