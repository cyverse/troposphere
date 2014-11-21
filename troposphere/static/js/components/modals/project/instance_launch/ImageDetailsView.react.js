/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: function(){
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      //
      // Render
      // ------
      //

      renderTag: function(tagName){
        return (
          <li>{tagName}</li>
        )
      },

      renderTags: function(image){
        return (
          <ul className="tags">{image.get('tags').map(this.renderTag)}</ul>
        )
      },

      render: function () {
        var image = this.props.image;

        return (
          <div className="image-details">
            <div className="name">{image.get('name')}</div>
            <div className="description">{image.get('description')}</div>
            {this.renderTags(image)}
          </div>
        );
      }

    });

  });
