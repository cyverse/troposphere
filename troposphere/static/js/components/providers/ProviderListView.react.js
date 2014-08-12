/** @jsx React.DOM */

define(
  [
    'react',
    'components/providers/Provider.react',
    'collections/InstanceCollection',
    'collections/VolumeCollection'
  ],
  function (React, Provider, InstanceCollection, VolumeCollection) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var providers = this.props.providers.map(function (provider) {

          // Get the identities belonging to this provider and cast as the original collection
          // type (which should be IdentityCollection)
          var providerIdentityArray = this.props.identities.where({'provider_id': provider.id});
          var providerIdentities = new this.props.identities.constructor(providerIdentityArray);

          // Filter Instances and Volumes for only those in this provider
          var providerInstanceArray = this.props.instances.filter(function(instance){
            return instance.get('identity').provider === provider.id;
          });
          var providerInstances = new InstanceCollection(providerInstanceArray);

          var providerVolumeArray = this.props.volumes.filter(function(volume){
            return volume.get('identity').provider === provider.id;
          });
          var providerVolumes = new VolumeCollection(providerVolumeArray);

          return (
            <Provider key={provider.id}
                      provider={provider}
                      identities={providerIdentities}
                      instances={providerInstances}
                      volumes={providerVolumes}
            />
          );
        }.bind(this));

        return (
          <div>
            <div className="container">
              {providers}
            </div>
          </div>
        );

      }

    });

  });
