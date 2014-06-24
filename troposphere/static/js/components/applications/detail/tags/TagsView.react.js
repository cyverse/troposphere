/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Tags.react'
  ],
  function (React, Backbone, Tags) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onSuggestTag: function(e){
        e.preventDefault();
        // todo: I have NO IDEA how this is getting triggered when clicking on an application and
        // navigating to the detail page.  Figure it out and remove the isMounted check.
        if(e.target.tagName === "A") alert("Tag suggestion featured not implemented yet.");
      },

      render: function () {
        return (
          <div className="image-tags">
            <h2 className='tag-title'>Image Tags</h2>
            <a href='#' onClick={this.onSuggestTag}>Suggest a Tag</a>
            <Tags tags={this.props.application.get('tags')}/>
          </div>
        );
      }

    });

  });
