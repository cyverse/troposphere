define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      Tag = require('./Tag.react');

  return React.createClass({
    display: "ViewTags",

    propTypes: {
      activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    render: function () {
      var tags = this.props.activeTags,
          content;

      tags.map(function(tag){
        return (
          <Tag key={tag.id || tag.cid} tag={tag}/>
        );
      }.bind(this));

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
