import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import ProjectImageCollection from "collections/ProjectImageCollection";
import ProjectImageConstants from "constants/ProjectImageConstants";
import ImageCollection from "collections/ImageCollection";
import Image from "models/Image";
import stores from "stores";


let _modelsFor = {};
let _isFetchingFor = {};
let _pendingProjectImages = new ImageCollection();

function addPending(model) {
    _pendingProjectImages.add(model);
}

function removePending(model) {
    _pendingProjectImages.remove(model);
}

var ProjectImageStore = BaseStore.extend({
    collection: ProjectImageCollection,

    initialize: function() {
        this.models = new ProjectImageCollection();
    },

    fetchModelsFor: function(projectId) {
        if (!_modelsFor[projectId] && !_isFetchingFor[projectId]) {
            _isFetchingFor[projectId] = true;
            var models = new ProjectImageCollection();
            models.fetch({
                url: models.url + "?project__id=" + projectId
            }).done(function() {
                _isFetchingFor[projectId] = false;
                // add models to existing cache
                this.models.add(models.models);

                // convert ProjectImage collection to an ImageCollection
                var images = models.map(function(project_image) {
                    return new Image(project_image.get("image"), {
                        parse: true
                    });
                });
                images = new ImageCollection(images);

                _modelsFor[projectId] = images;
                this.emitChange();
            }.bind(this));
        }
    },

    getImagesCountFor: function(project) {
        if (!project.id) return 0;
        if (!_modelsFor[project.id]) {
            return this.fetchModelsFor(project.id);
        }

        return _modelsFor[project.id].length;
    },

    getSharedImages: function() {
        return new ImageCollection();
    },
    getImagesFor: function(project) {
        if (!project.id) return;
        if (!_modelsFor[project.id]) return this.fetchModelsFor(project.id);

        let images = this.models.filter( (pi) => {
            return pi.get("project").id === project.id;
        }).map( (pi) => {
            return new Image(pi.get("image"), {parse: true});
        });

        return new ImageCollection(images);
    },

    getProjectsFor: function(imageId) {
        var allProjects = stores.ImageStore.getProjects(imageId);
        if (!imageId) return;
        if (!allProjects) return;

        return allProjects;
    }
});

let store = new ProjectImageStore();

Dispatcher.register(function(dispatch) {
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

export default store;
