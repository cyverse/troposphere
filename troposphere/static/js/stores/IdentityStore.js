define(function(require) {

  var BaseStore = require('stores/BaseStore'),
      IdentityCollection = require('collections/IdentityCollection');

  var IdentityStore = BaseStore.extend({
    collection: IdentityCollection,

    getIdentityFor: function(provider){
      if(!this.models) return this.fetchModels();

      var identity = this.models.find(function(identity){
        return identity.get('provider').id === provider.id;
      });

      return identity;
    }

  });

  var store = new IdentityStore();

  return store;

});
