/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react',
    'stores'
  ],
  function (React, Backbone, ResourceDetail, stores) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance,
            size = stores.SizeStore.get(instance.get('size').id);

        if(!size){
          return (
            <div className="loading-tiny-inline"></div>
          );
        }

        return (
          <ResourceDetail label="Size">
            {size.formattedDetails()}
          </ResourceDetail>
        );
      }

    });

  });
