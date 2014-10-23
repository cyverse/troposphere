define(
  [
    'backbone'
  ],
  function (Backbone) {

    return Backbone.Model.extend({

      parse: function(response){

        // put default allocation data here since it isn't
        // in the data structure for admins (but we want it
        // in the object for consistency)
        if(!response.quota.allocation){
          response.quota.allocation = {
            current: 168,
            threshold: 168
          }
        }

        return response;
      },

      _getInstancesBelongingToThisIdentity: function(instances){
        return instances.filter(function(instance){
          var isInIdentity = instance.get('identity').id === this.id;
          var isDeductingFromAUs = instance.get('status') !== "suspended";
          return isInIdentity && isDeductingFromAUs;
        }.bind(this));
      },

      _getVolumesBelongingToThisIdentity: function(volumes){
        return volumes.filter(function(volume){
          return volume.get('identity').id === this.id;
        }.bind(this));
      },

      getInstancesConsumingAllocation: function(instances){
        var relevantInstances = this._getInstancesBelongingToThisIdentity(instances);

        return relevantInstances.filter(function(instance){
          return instance.get('status') !== "suspended";
        });
      },

      getCpusUsed: function(instances, sizes){
        var relevantInstances = this._getInstancesBelongingToThisIdentity(instances);

        return relevantInstances.reduce(function(total, instance){
          var size = sizes.get(instance.get('size_alias'));
          return total + size.get('cpu');
        }, 0);
      },

      getMemoryUsed: function(instances, sizes){
        var relevantInstances = this._getInstancesBelongingToThisIdentity(instances);

        return relevantInstances.reduce(function(total, instance){
          var size = sizes.get(instance.get('size_alias'));
          return total + size.get('mem');
        }, 0);
      },

      getStorageUsed: function(volumes){
        var relevantVolumes = this._getVolumesBelongingToThisIdentity(volumes);

        return relevantVolumes.reduce(function(total, volume){
          var size = volume.get('size');
          return total + size;
        }, 0);
      },

      getStorageCountUsed: function(volumes){
        var relevantVolumes = this._getVolumesBelongingToThisIdentity(volumes);
        return relevantVolumes.length;
      }

    });

  });
