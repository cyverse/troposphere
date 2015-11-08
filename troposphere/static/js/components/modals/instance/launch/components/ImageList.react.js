import React from 'react';
import Backbone from 'backbone';
import Image from './Image.react';

export default React.createClass({
      displayName: "ImageList",

      propTypes: {
        images: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onClick: React.PropTypes.func
      },

      renderImage: function (image) {
        return (
          <Image key={image.id} image={image} onClick={this.props.onClick}/>
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
