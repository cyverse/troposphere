define(
  [
    'underscore',
    'collections/TagCollection',
    'dispatchers/Dispatcher',
    'stores/Store',
    'constants/TagConstants',
    'models/Tag',
    'controllers/NotificationController'
  ],
  function (_, TagCollection, Dispatcher, Store, TagConstants, Tag, NotificationController) {

    var _tags = null;
    var _isFetching = false;

    //
    // CRUD Operations
    //

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

    function create(name, description){
      var tag = new Tag({
        name: name,
        description: description
      });

      tag.save().done(function(){
        TagStore.emitChange();
      }).fail(function(){
        var failureMessage = "Error creating Tag " + tag.get('name') + ".";
        NotificationController.error(failureMessage);
        _tags.remove(tag);
        TagStore.emitChange();
      });
      _tags.add(tag);
    }

    //
    // Store
    //

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

      switch (action.actionType) {
         case TagConstants.TAG_CREATE:
           create(action.name, action.description);
           break;

         default:
           return true;
      }

      TagStore.emitChange();

      return true;
    });

    _.extend(TagStore, Store);

    return TagStore;
  });
