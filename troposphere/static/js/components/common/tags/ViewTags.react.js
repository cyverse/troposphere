import React from 'react';
import Backbone from 'backbone';
import Tag from './Tag.react';

export default React.createClass({
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
