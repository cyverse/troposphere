define(function (require) {

  var Dispatcher = require('dispatchers/Dispatcher'),
    BaseStore = require('stores/BaseStore'),
    ProjectImageCollection = require('collections/ProjectImageCollection'),
    ProjectImageConstants = require('constants/ProjectImageConstants'),
    ImageCollection = require('collections/ImageCollection'),
    Image = require('models/Image'),
    stores = require('stores');

  var _modelsFor = {};
  var _isFetchingFor = {};
  var _pendingProjectImages = new ImageCollection();

  function addPending(model) {
    _pendingProjectImages.add(model);
  }

  function removePending(model) {
    _pendingProjectImages.remove(model);
  }

  var ProjectStore = BaseStore.extend({
    collection: ProjectImageCollection,

    initialize: function () {
      this.models = new ProjectImageCollection();
    },

    fetchModelsFor: function (projectId) {
      if (!_modelsFor[projectId] && !_isFetchingFor[projectId]) {
        _isFetchingFor[projectId] = true;
        var models = new ProjectImageCollection();
        models.fetch({
          url: models.url + "?project__id=" + projectId
        }).done(function () {
          _isFetchingFor[projectId] = false;
          // add models to existing cache
          this.models.add(models.models);

          // convert ProjectImage collection to an ImageCollection
          var images = models.map(function (project_image) {
            return new Image(project_image.get('image'), {parse: true});
          });
          images = new ImageCollection(images);

          _modelsFor[projectId] = images;
          this.emitChange();
        }.bind(this));
      }
    },

    getImagesFor: function (project) {
      //NOTE: The logic here falls to pieces. As a result we actually need _all_ the images in order to ensure that the images
      // Added by _user_ can be searched through in the filter-filter-filter that happens below.
      var allImages = stores.ImageStore.getForProject(project.id);
      if (!allImages) return;

      return allImages;
    }
  });

  var store = new ProjectStore();

  Dispatcher.register(function (dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

      case ProjectImageConstants.ADD_PROJECT_IMAGE:
        store.add(payload.projectImage);
        break;

      case ProjectImageConstants.REMOVE_PROJECT_IMAGE:
        store.remove(payload.projectImage);
        break;

      case ProjectImageConstants.ADD_PENDING_PROJECT_IMAGE:
        addPending(payload.projectImage);
        break;

      case ProjectImageConstants.REMOVE_PENDING_PROJECT_IMAGE:
        removePending(payload.projectImage);
        break;

      case ProjectImageConstants.EMIT_CHANGE:
        break;

      default:
        return true;
    }

    if (!options.silent) {
      store.emitChange();
    }

    return true;
  });

  return store;
});
