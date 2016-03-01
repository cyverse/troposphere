define(function (require) {
  "use strict";

  var React = require('react'),
    Backbone = require('backbone'),
    Router = require('react-router');

  return React.createClass({

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

});
