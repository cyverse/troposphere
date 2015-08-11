define(function (require) {

  var BaseStore = require('stores/BaseStore'),
    InstanceHistoryCollection = require('collections/InstanceHistoryCollection'),
    actions = require('actions');

  var InstanceHistoryStore = BaseStore.extend({
    collection: InstanceHistoryCollection,

    queryParams: {
      page: 1
    }
  });

  // Returns the entire local cache, everything in this.models
  InstanceHistoryStore.prototype.getAllAndCheckBadges = function () {
    if (!this.models) {
      this.fetchModels();//done(function(){console.log("done!");});
    } else {
      actions.BadgeActions.checkInstanceBadges();  
      return this.models;
    }
  };

  var store = new InstanceHistoryStore();

  return store;
});
