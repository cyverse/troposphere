define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      globals = require('globals'),
      BadgeCollection = require('collections/BadgeCollection');

  var  BadgeStore = BaseStore.extend({
    collection: BadgeCollection
  });

  var store = new BadgeStore();

  return store;
});
