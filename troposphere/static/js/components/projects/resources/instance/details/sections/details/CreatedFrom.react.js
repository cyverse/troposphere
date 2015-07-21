define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    ResourceDetail = require('components/projects/common/ResourceDetail.react'),
    Router = require('react-router'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var instance = this.props.instance,
        image = stores.ApplicationStore.get(instance.get('image').id);

      if (!image) {
        return (
          <div className="loading-tiny-inline"></div>
        );
      }

      return (
        <ResourceDetail label="Based on">
          <Router.Link to="image-details" params={{imageId: image.id}}>
            {image.get('name')}
          </Router.Link>
        </ResourceDetail>
      );
    }

  });

});
