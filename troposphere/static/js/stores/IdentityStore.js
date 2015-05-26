define(function(require) {

  var _ = require('underscore'),
      BaseStore = require('stores/BaseStore'),
      IdentityCollection = require('collections/IdentityCollection'),
      AppDispatcher = require('dispatchers/AppDispatcher');

  var IdentityStore = BaseStore.extend({

    getIdentityFor: function(provider){
      if(!this.models) return this.fetchModels();

      var identity = this.models.find(function(identity){
        return identity.get('provider').id === provider.id;
      });

      return identity;
    }

  });

  return new IdentityStore(null, {
    collection: IdentityCollection
  });

});
