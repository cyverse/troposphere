define(function (require) {

  let React = require('react/addons'),
    Backbone = require('backbone'),
    stores = require('stores'),
    ProviderCollection = require('collections/ProviderCollection'),
    IdentityCollection = require('collections/IdentityCollection'),
    ProviderSummaryLinePlot = require('components/dashboard/plots/ProviderSummaryLinePlot.react'),
    ResourceStatusSummaryPlot = require('components/dashboard/plots/ResourceStatusSummaryPlot.react');

  return React.createClass({
    displayName: "Resources",

    propTypes: {
      provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      let provider = this.props.provider,
        identity = stores.IdentityStore.findOne({'provider.id': provider.id}),
        instances = stores.InstanceStore.findWhere({'provider.id': provider.id}),
        volumes = stores.VolumeStore.findWhere({
          'provider.id': provider.id
        }),
        sizes = stores.SizeStore.fetchWhere({
          provider__id: provider.id,
          page_size: 100
        });

      if (!provider || !identity || !instances || !volumes || !sizes) return <div className="loading"></div>;

      let providers = new ProviderCollection([provider]),
        identities = new IdentityCollection([identity]);

      return (
        <div className="row provider-info-section">
          <h4>Resources</h4>

          <div className="provider">
            <div className="row">
              <div className="col-md-8">
                <ProviderSummaryLinePlot
                  providers={providers}
                  identities={identities}
                  instances={instances}
                  volumes={volumes}
                  sizes={sizes}
                  />
              </div>
              <div className="col-md-4">
                <ResourceStatusSummaryPlot
                  title="Instances"
                  provider={provider.id}
                  resources={instances}
                  />
                <ResourceStatusSummaryPlot
                  title="Volumes"
                  provider={provider.id}
                  resources={volumes}
                  />
              </div>
            </div>
          </div>
        </div>
      );

    }

  });

});
