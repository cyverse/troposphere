define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      Router = require('react-router'),
      //Router = require('router'),
      // plugin: required but not used directly
      bootstrap = require('bootstrap');

  return React.createClass({
    display: "Tag",

    propTypes: {
      tag: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    componentDidMount: function(){
      var el = this.getDOMNode(),
          $el = $(el),
          tag = this.props.tag;

      $el.tooltip({
        title: tag.get('description')
      });
    },

    onClick: function(){
      Router.getInstance().transitionTo("search", {}, {q: this.props.tag.get('name')});
    },

    render: function () {
      var tag = this.props.tag;

      return (
        <li className="tag">
          <Router.Link to="search" query={{q: tag.get('name')}}>{tag.get('name')}</Router.Link>
        </li>
      );

    }

  });

});
