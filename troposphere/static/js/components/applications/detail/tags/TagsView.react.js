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
        alert("Tag suggestion featured not implemented yet.")
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
