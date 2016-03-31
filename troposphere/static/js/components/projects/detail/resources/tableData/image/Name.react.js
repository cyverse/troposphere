import React from 'react';
import Backbone from 'backbone';
import Router from 'react-router';

export default React.createClass({
    mixins: [Router.State],

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var image = this.props.image;

      if (!image.id) {
        return (
          <span>{image.get('name')}</span>
        );
      }

      return (
        <Router.Link to="image-details" params={{imageId: image.id}}>
          {image.get('name')}
        </Router.Link>
      );
    }
});
