define(
  [
    'underscore',
    'collections/TagCollection',
    'dispatchers/Dispatcher',
    'stores/Store',
    'constants/TagConstants',
    'models/Tag',
    'controllers/NotificationController',
    'actions/InstanceActions'
  ],
  function (_, TagCollection, Dispatcher, Store, TagConstants, Tag, NotificationController, InstanceActions) {

    var _tags = null;
    var _isFetching = false;
    var _pendingInstanceTags = {};

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

    function create(name, description, options){
      options = options || {};

      var tag = new Tag({
        name: name,
        description: description
      });

      if(options.afterCreate) options.afterCreate(tag);

      tag.save().done(function(){
        if(options.afterSave) options.afterSave(tag);
        TagStore.emitChange();
      }).fail(function(){
        var failureMessage = "Error creating Tag " + tag.get('name') + ".";
        NotificationController.error(failureMessage);

        if(options.afterSaveError) options.afterSaveError(tag);
        _tags.remove(tag);
        TagStore.emitChange();
      });
      _tags.add(tag);
    }

    function create_AddToInstance(name, description, instance){
      create(name, description, {
        afterCreate: function(tag){
          _pendingInstanceTags[instance.id] = _pendingInstanceTags[instance.id] || new TagCollection();
          _pendingInstanceTags[instance.id].add(tag);
        },
        afterSave: function(tag){
          _pendingInstanceTags[instance.id].remove(tag);
          InstanceActions.addTagToInstance(tag, instance);
        },
        afterSaveError: function(tag){
          _pendingInstanceTags[instance.id].remove(tag);
        }
      })
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
      },

      getInstanceTags: function (instance) {
        if(!_tags) throw new Error("Must fetch tags before calling getInstanceTags");

        var instanceTagArray = instance.get('tags').map(function(tagName){
          var tag = _tags.findWhere({name: tagName}, {parse: true});
          if(!tag) throw new Error("Expected to find a tag with name '" + tagName +"'");
          return tag;
        });

        // Add any pending tags to the result set
        var pendingInstanceTags = _pendingInstanceTags[instance.id];
        if(pendingInstanceTags){
          instanceTagArray = instanceTagArray.concat(pendingInstanceTags.models);
        }

        return new TagCollection(instanceTagArray);
      }

    };

    Dispatcher.register(function (payload) {
      var action = payload.action;

      switch (action.actionType) {
         case TagConstants.TAG_CREATE:
           create(action.name, action.description);
           break;

        case TagConstants.TAG_CREATE_AND_ADD_TO_INSTANCE:
            create_AddToInstance(action.name, action.description, action.instance);
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
