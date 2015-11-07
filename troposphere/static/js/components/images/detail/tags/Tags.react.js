import React from 'react';
import Backbone from 'backbone';
import Tag from 'components/common/tags/Tag.react';

export default React.createClass({
      displayName: "Tags",

      propTypes: {
        activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var tags = this.props.activeTags.map(function (tag) {
          return (
            <Tag key={tag.id || tag.cid} tag={tag}/>
          );
        }.bind(this));

        return (
          <ul className="tags clearfix">
            {tags}
          </ul>
        );
      }
});
