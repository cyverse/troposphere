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

  // Fetch models and check badges when data is retreived 
  InstanceHistoryStore.prototype.getAllAndCheckBadges = function () {
    this.getAll();
    this.addChangeListener(function(){
        actions.BadgeActions.checkInstanceBadges();
    });
  };

  var store = new InstanceHistoryStore();

  return store;
});
