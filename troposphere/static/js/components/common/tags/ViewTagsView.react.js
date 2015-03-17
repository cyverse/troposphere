define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      context = require('context'),
      ViewTags = require('./ViewTags.react');

  return React.createClass({
    display: "ViewTagsView",

    propTypes: {
      activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    onSuggestTag: function(e){
      e.preventDefault();
      // todo: I have NO IDEA how this is getting triggered when clicking on an application and
      // navigating to the detail page.  Figure it out and remove the isMounted check.
      if(e.target.tagName === "A") {
        alert("Tag suggestion featured not implemented yet.");
      }
    },

    render: function () {
      var suggestTag;

      // todo: enable suggest-a-tag when it's a supported feature
      if(context.profile && false){
        suggestTag = (
          <a href='#' onClick={this.onSuggestTag}>Suggest a Tag</a>
        );
      }

      return (
        <div className="image-tags">
          <h2 className='tag-title'>Image Tags</h2>
          {suggestTag}
          <ViewTags activeTags={this.props.activeTags}/>
        </div>
      );

    }

  });

});
