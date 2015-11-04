define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Tag = require('./Tag.react');

  return React.createClass({
    displayName: "ViewTags",

    propTypes: {
      activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      renderLinks: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        renderLinks: true
      }
    },

    renderTag: function (tag) {
      return (
        <Tag key={tag.id || tag.cid} tag={tag} renderLinks={this.props.renderLinks}/>
      );
    },

    render: function () {
      var tags = this.props.activeTags,
        content;

      if (tags.length > 0) {
        content = tags.map(this.renderTag);
      } else {
        content = (
          <p>This resource has not been tagged.</p>
        )
      }

      return (
        <ul className="tags">
          {content}
        </ul>
      );

    }

  });

});
