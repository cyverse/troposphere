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
    var _pendingImageTags = {};

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
      var existingModel = _tags.get(tag);
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

    function addPendingTagToImage(tag, image){
      _pendingImageTags[image.id] = _pendingImageTags[image.id] || new TagCollection();
      _pendingImageTags[image.id].add(tag);
    }

    function removePendingTagFromImage(tag, image){
      _pendingImageTags[image.id].remove(tag);
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

      getImageTags: function (image) {
        if(!_tags) throw new Error("Must fetch tags before calling getImageTags");

        var imageTagArray = image.get('tags').map(function(tag){
          //var tagName = tag.name;
          //var tag = _tags.findWhere({name: tagName}, {parse: true});
          //if(!tag) throw new Error("Expected to find a tag with name '" + tagName +"'");
          return tag;
        });

        // Add any pending tags to the result set
        var pendingImageTags = _pendingImageTags[image.id];
        if(pendingImageTags){
          imageTagArray = imageTagArray.concat(pendingImageTags.models);
        }

        return new TagCollection(imageTagArray);
      },

      getTagsFromArrayOfNames: function (tagNames) {
        if(!_tags) throw new Error("Must fetch tags before calling getTagsFromArrayOfNames");

        var tagArray = tagNames.map(function(tagName){
          var tag = _tags.findWhere({name: tagName}, {parse: true});
          if(!tag) throw new Error("Expected to find a tag with name '" + tagName +"'");
          return tag;
        });

        return new TagCollection(tagArray);
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

        case TagConstants.ADD_PENDING_TAG_TO_IMAGE:
          addPendingTagToImage(payload.tag, payload.image);
          break;

        case TagConstants.REMOVE_PENDING_TAG_FROM_IMAGE:
          removePendingTagFromImage(payload.tag, payload.image);
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
