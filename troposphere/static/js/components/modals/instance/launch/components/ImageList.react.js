
define(
  [
    'react',
    'backbone',
    './Image.react'
  ],
  function (React, Backbone, Image) {

    return React.createClass({
      displayName: "ImageList",

      propTypes: {
        images: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onClick: React.PropTypes.func
      },

      renderImage: function (image) {
        return (
          <Image key={image.id} image={image} callBack={this.props.callBack}/>
        )
      },

      render: function () {
        return (
          <ul className="app-card-list modal-list">
            {this.props.images.map(this.renderImage)}
            {this.props.children}
          </ul>
        );
      }

    });

  });
