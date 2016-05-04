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

  var ProjectImageStore = BaseStore.extend({
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
      var allImages = stores.ImageStore.getForProject(project.id);
      if (!project.id) return;
      if (!_modelsFor[project.id]) return this.fetchModelsFor(project.id);
      if (!allImages) return;

      var images = this.models.filter(function (project_image) {
        // filter out irrelevant project images (not in target project)
        return project_image.get('project').id === project.id;
      }).filter(function (project_image) {
        // filter out the images that don't exist (not in local cache)
        return allImages.get(project_image.get('image').id);
      }).map(function (project_image) {
        // return the actual images
        return allImages.get(project_image.get('image').id);
      });
      return new ImageCollection(images);
    }
  });

  var store = new ProjectImageStore();

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
