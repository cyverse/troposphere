/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Image.react'
  ],
  function (React, Backbone, Image) {

    return React.createClass({
      propTypes: {
        images: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      renderImage: function(image){
        return (
          <Image image={image}/>
        )
      },

      render: function () {
        return (
          <ul>
            {this.props.images.map(this.renderImage)}
          </ul>
        );
      }

    });

  });
