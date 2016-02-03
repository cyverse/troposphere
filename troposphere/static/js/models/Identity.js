define(function (require) {

  var Backbone = require('backbone');

  function isRelevant(model, identityId) {
        // using double ~ to convert string to number
        return model.id && model.get('identity') &&
            ~~model.get('identity').id === identityId;

  }

  return Backbone.Model.extend({

    parse: function (attributes) {

      // todo: put this in the API
      if (attributes.usage.current === null || attributes.usage.current === undefined) {
        attributes.allocation.current = 0;
      } else {
        attributes.allocation.current = attributes.usage.current;
      }

      return attributes;
    },

    getInstancesConsumingAllocation: function (instances) {
      var identityId = this.id;

      return instances.filter(function (instance) {
        if (isRelevant(instance, identityId)) {
          return instance.get('status') === "active";
        } else {
          return false;
        }
      });
    },

    getCpusUsed: function (instances, sizes) {
      var identityId = this.id;

      return instances.reduce(function (total, instance) {
        if (isRelevant(instance, identityId)) {
          var size = sizes.get(instance.get('size').id);
          return total + size.get('cpu');
        } else {
          return total;
        }
      }, 0);
    },

    getMemoryUsed: function (instances, sizes) {
      var identityId = this.id;

      return instances.reduce(function (total, instance) {
        if (isRelevant(instance, identityId)) {

          var size = sizes.get(instance.get('size').id);
          return total + size.get('mem');
        } else {
          return total;
        }
      }, 0);
    },

    getStorageUsed: function (volumes) {
      var identityId = this.id;

      return volumes.reduce(function (total, volume) {
        if (isRelevant(volume, identityId)) {
          var size = volume.get('size');
          return total + size;
        } else {
          return total;
        }
      }, 0);
    },

    getStorageCountUsed: function (volumes) {
      var identityId = this.id;

      return volumes.reduce(function (total, volume) {
        if (isRelevant(volume, identityId)) {
          return total + 1;
        } else {
          return total;
        }
      }, 0);
    }

  });

});
