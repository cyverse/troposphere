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
      tag: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      renderLinks: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        renderLinks: true
      }
    },

    componentDidMount: function () {
      var el = this.getDOMNode(),
        $el = $(el),
        tag = this.props.tag;

      $el.tooltip({
        title: tag.get('description')
      });
    },

    onClick: function () {
      Router.getInstance().transitionTo("search", {}, {q: this.props.tag.get('name')});
    },

    render: function () {
      var tag = this.props.tag,
        tagName = tag.get('name'),
        link;

      if (this.props.renderLinks) {
        link = (
          <Router.Link to="search" query={{q: tagName}}>
            {tagName}
          </Router.Link>
        );
      } else {
        link = (
          <a href="javascript:void(0)">{tagName}</a>
        )
      }

      return (
        <li className="tag">
          {link}
        </li>
      );

    }

  });

});
