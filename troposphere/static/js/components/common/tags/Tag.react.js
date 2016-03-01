import React from 'react/addons';
import $ from "jquery";
import Backbone from 'backbone';
import Router from 'react-router';
// plugin: required but not used directly
import bootstrap from 'bootstrap';

export default React.createClass({
    displayName: "Tag",

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
        title: tag.get('description'),
        placement: 'left'
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
