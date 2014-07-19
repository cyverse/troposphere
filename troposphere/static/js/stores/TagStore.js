define(
  [
    'underscore',
    'collections/TagCollection',
    'dispatchers/Dispatcher',
    'stores/Store'
  ],
  function (_, TagCollection, Dispatcher, Store) {

    var _tags = null;
    var _isFetching = false;

    var fetchTags = function () {
      if(!_isFetching) {
        _isFetching = true;
        var tags = new TagCollection();
        tags.fetch().done(function () {
          _isFetching = false;
          _tags = tags;
          TagStore.emitChange();
        });
      }
    };

    var TagStore = {

      get: function (tagId) {
        if(!_tags) {
          fetchTags();
        } else {
          return _tags.get(tagId);
        }
      },

      getAll: function () {
        if(!_tags) {
          fetchTags();
        } else {
          return _tags;
        }
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      // switch (action.actionType) {
      //   case ApplicationConstants.APPLICATION_TOGGLE_FAVORITED:
      //     ApplicationStore.toggleFavorited(action.application);
      //     break;
      //
      //   default:
      //     return true;
      // }

      TagStore.emitChange();

      return true;
    });

    _.extend(TagStore, Store);

    return TagStore;
  });
