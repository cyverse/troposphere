/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/tags/Tag.react'
  ],
  function (React, Tag) {

    return React.createClass({

      propTypes: {
        activeTags: React.PropTypes.array.isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var tags = this.props.activeTags.map(function(tagName) {
          var tag = this.props.tags.findWhere({name: tagName});
          return (
            <Tag key={tag.id} tag={tag}/>
          );
        }.bind(this));

        return (
          <ul className="tags">
            {tags}
          </ul>
        );
      }

    });

  });
