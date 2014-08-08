/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Tag.react'
  ],
  function (React, Backbone, Tag) {

    return React.createClass({

      propTypes: {
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        activeTags: React.PropTypes.array.isRequired
      },

      render: function () {
        var tags = this.props.activeTags.map(function(tagName){
          var tag = this.props.tags.findWhere({name: tagName});
          return (
            <Tag key={tag.id}
                 tag={tag}
            />
          );
        }.bind(this));

        var content;
        if(tags.length > 0){
          content = tags;
        }else{
          content = (
            <span>This resource has not been tagged.</span>
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
