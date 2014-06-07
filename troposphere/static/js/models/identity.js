define(
  [
    'backbone',
    'underscore',
    'collections/InstanceCollection',
    'collections/volumes'
  ],
  function (Backbone, _, InstanceCollection, Volumes) {

    return Backbone.Model.extend({

      initialize: function (attributes, options) {
        attributes.quota.mem *= 1024;
      },

      parse: function (response) {
        var attributes = response;

        attributes.id = response.id;
        attributes.provider_id = response.provider_id;
        //attributes.credentials = response.credentials;
        attributes.quota = response.quota;
        attributes.quota.mem = response.quota.mem * 1024;
        attributes.quota.cpu = response.quota.cpu;
        attributes.quota.disk = response.quota.disk;
        attributes.quota.disk_count = response.quota.disk_count;

        return attributes;
      },

      has_allocation: function () {
        return ( typeof this.attributes.quota.allocation != 'undefined')
      },

      get_collection: function (cls, key) {
        var collection = this.get(key);
        if (!collection) {
          collection = new cls(null, {
            provider_id: this.get('provider_id'),
            identity_id: this.id
          });
          this.set(key, collection);
        }
        return collection;
      },

      instances: function () {
        return this.get_collection(InstanceCollection, '_instances');
      },

      volumes: function () {
        return this.get_collection(Volumes, '_volumes');
      }
    });

  });
