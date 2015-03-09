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
            provider = stores.ProviderStore.get(instance.get('provider').id);

        if(!provider) return <div className="loading-tiny-inline"></div>;

        return (
          <ResourceDetail label="Provider">
            {provider.get('name')}
          </ResourceDetail>
        );
      }

    });

  });
