define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores'),
      ProviderCollection = require('collections/ProviderCollection');

  return React.createClass({

    propTypes: {
      provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var provider = this.props.provider,
          providers = new ProviderCollection([provider]),
          identities = stores.IdentityStore.getAll(),
          instances = stores.InstanceStore.getInstancesOnProvider(provider),
          volumes = stores.VolumeStore.getVolumesOnProvider(provider),
          sizes = stores.SizeStore.getSizesFor(provider);

      if(!provider || !identities || !instances || !volumes || !sizes) return <div className="loading"></div>;

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
                  isPolarPlot={false}
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
