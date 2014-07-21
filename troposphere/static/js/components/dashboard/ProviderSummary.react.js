/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores/SizeStore'
  ],
  function (React, Backbone, SizeStore) {

    return React.createClass({

      propTypes: {
        identity: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      calculateCpuUsage: function(instances, provider, quota, sizes){
        var maxCpuCount = quota.cpu;

        var providerInstances = instances.filter(function(instance){
          return instance.get('identity').provider === provider.id;
        });

        var currentCpuCount = providerInstances.reduce(function(memo, instance){
          var size = sizes.findWhere({alias: instance.get('size_alias')});
          return memo + size.get('cpu');
        }.bind(this), 0);

        return currentCpuCount + "/" + maxCpuCount;
      },

      calculateStorageUsage: function(volumes, provider, quota){
        var maxStorage = quota.disk;

        var providerVolumes = volumes.filter(function(volume){
          return volume.get('identity').provider === provider.id;
        });

        var currentStorageCount = providerVolumes.reduce(function(memo, volume){
          return memo + volume.get('size')
        }.bind(this), 0);

        return currentStorageCount + "/" + maxStorage;
      },

      render: function () {
        var identity = this.props.identity;
        var provider = this.props.providers.get(identity.get('provider_id'));
        var quota = identity.get('quota');

        var sizes = SizeStore.getAllFor(provider.id, identity.id);
        if(sizes){
          var cpuUsage = this.calculateCpuUsage(this.props.instances, provider, quota, sizes);
          var storageUsage = this.calculateStorageUsage(this.props.volumes, provider, quota);

          return (
            <div>
              <h4>{provider.get('name')}</h4>
              <ul>
                <li>{cpuUsage + " CPUs"}</li>
                <li>{storageUsage + " GBs Storage"}</li>
              </ul>
            </div>
          );
        }

        return (
          <div className="loading"></div>
        );
      }

    });

  });
