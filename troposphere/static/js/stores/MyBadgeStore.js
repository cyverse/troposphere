define(function (require) {

  var BaseStore = require('stores/BaseStore'),
      stores = require('stores'),
      globals = require('globals'),
      BadgeConstants = require('constants/BadgeConstants'),
      Dispatcher = require('dispatchers/Dispatcher'),
      MyBadgeCollection = require('collections/MyBadgeCollection');

  var MyBadgeStore = BaseStore.extend({
    collection: MyBadgeCollection,

    queryParams: {
      system: globals.BADGE_SYSTEM,
      secret: globals.BADGE_SECRET,
      email: "josephgarcia@iplantcollaborative.org"
    }
  });

  var store = new MyBadgeStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {
      case BadgeConstants.GRANT_BADGE:
        store.add(payload.badge);
        break;

       default:
         return true;
    }

    if(!options.silent) {
      store.emitChange();
    }

    return true;
  });

  return store;
});
