define(
  [
    'underscore',
    'collections/TagCollection',
    'dispatchers/Dispatcher',
    'stores/Store',
    'constants/TagConstants'
  ],
  function (_, TagCollection, Dispatcher, Store, TagConstants) {

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

    function add(tag, options){
      _tags.add(tag);
    }

    function update(tag, options){
      var existingModel = _tags.find(tag);
      if(!existingModel) throw new Error("Tag doesn't exist.");
      _tags.add(tag, {merge: true});
    }

    function remove(tag, options){
      _tags.remove(tag);
    }

    function addPendingTagToInstance(tag, instance){
      _pendingInstanceTags[instance.id] = _pendingInstanceTags[instance.id] || new TagCollection();
      _pendingInstanceTags[instance.id].add(tag);
    }

    function removePendingTagFromInstance(tag, instance){
      _pendingInstanceTags[instance.id].remove(tag);
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

    Dispatcher.register(function (dispatch) {
      var actionType = dispatch.action.actionType;
      var payload = dispatch.action.payload;
      var options = dispatch.action.options || options;

      switch (actionType) {
        case TagConstants.ADD_TAG:
          add(payload.tag);
          break;

        case TagConstants.UPDATE_TAG:
          update(payload.tag);
          break;

        case TagConstants.REMOVE_TAG:
          remove(payload.tag);
          break;

        case TagConstants.ADD_PENDING_TAG_TO_INSTANCE:
          addPendingTagToInstance(payload.tag, payload.instance);
          break;

        case TagConstants.REMOVE_PENDING_TAG_FROM_INSTANCE:
          removePendingTagFromInstance(payload.tag, payload.instance);
          break;

         default:
           return true;
      }

      if(!options.silent) {
        TagStore.emitChange();
      }

      return true;
    });

    _.extend(TagStore, Store);

    return TagStore;
  });
