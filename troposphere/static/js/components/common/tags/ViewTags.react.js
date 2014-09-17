/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Tag.react'
  ],
  function (React, Backbone, Tag) {

    return React.createClass({
      display: "ViewTags",

      propTypes: {
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var tags = this.props.activeTags.map(function(tag){
          return (
            <Tag key={tag.id || tag.cid} tag={tag}/>
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
