/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/tags/Tag.react'
  ],
  function (React, Backbone, Tag) {

    return React.createClass({
      display: "Tags",

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

  });
