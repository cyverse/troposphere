/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react',
    'react-router',
    'stores'
  ],
  function (React, Backbone, ResourceDetail, Router, stores) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance,
            image = stores.ApplicationStore.get(instance.get('image').id);

        if(!image){
          return (
            <div className="loading-tiny-inline"></div>
          );
        }

        return (
          <ResourceDetail label="Based on">
            <Router.Link to="image" params={{imageId: image.id}}>
              {image.get('name')}
            </Router.Link>
          </ResourceDetail>
        );
      }

    });

  });
