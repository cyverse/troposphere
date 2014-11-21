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
        images: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onClick: React.PropTypes.func
      },

      renderImage: function(image){
        return (
          <Image key={image.id} image={image} onClick={this.props.onClick}/>
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
