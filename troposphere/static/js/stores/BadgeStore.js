define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      globals = require('globals'),
      BadgeCollection = require('collections/BadgeCollection');

  var  BadgeStore = BaseStore.extend({
    collection: BadgeCollection,

    queryParams: {
      system: globals.BADGE_SYSTEM,
      secret: globals.BADGE_SECRET
    }
  });

  var store = new BadgeStore();

  return store;
});
