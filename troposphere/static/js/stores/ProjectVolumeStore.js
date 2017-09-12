
import Dispatcher from "dispatchers/Dispatcher";
import BaseStore from "stores/BaseStore";
import ProjectVolumeCollection from "collections/ProjectVolumeCollection";
import ProjectVolumeConstants from "constants/ProjectVolumeConstants";
import VolumeCollection from "collections/VolumeCollection";
import stores from "stores";

let _pendingProjectVolumes = new VolumeCollection();

function addPending(model) {
    _pendingProjectVolumes.add(model);
}

function removePending(model) {
    _pendingProjectVolumes.remove(model);
}

let ProjectStore = BaseStore.extend({
    collection: ProjectVolumeCollection,

    getVolumesFor: function(project) {
        var allVolumes = stores.VolumeStore.getAll();
        if (!project.id) return;
        if (!this.models) return this.fetchModels();
        if (!allVolumes) return;

        var volumes = this.models.filter(function(pv) {
            // filter out irrelevant project volumes (not in target project)
            let compare_project = pv.get("project");
            return (compare_project &&
                compare_project.id === project.id);
        }).filter(function(pv) {
            // filter out the volumes that don't exist (not in local cache)
            return allVolumes.get(pv.get("volume").id);
        }).map(function(pv) {
            // return the actual volumes
            return allVolumes.get(pv.get("volume").id);
        });

        var pendingVolumes = _pendingProjectVolumes.filter(function(pv) {
            // filter out irrelevant project volumes (not in target project)
            let compare_project = pv.get("project");
            return (compare_project &&
                compare_project.id === project.id);
        }).filter(function(pv) {
            // filter out the volumes that don't exist (not in local cache)
            return allVolumes.get(pv.get("volume"));
        }).map(function(pv) {
            // return the actual volumes
            return allVolumes.get(pv.get("volume"));
        });

        return new VolumeCollection(volumes.concat(pendingVolumes));
    }
});

let store = new ProjectStore();

Dispatcher.register(function(dispatch) {
    var actionType = dispatch.action.actionType;
    var payload = dispatch.action.payload;
    var options = dispatch.action.options || options;

    switch (actionType) {

        case ProjectVolumeConstants.ADD_PROJECT_VOLUME:
            store.add(payload.projectVolume);
            break;

        case ProjectVolumeConstants.REMOVE_PROJECT_VOLUME:
            store.remove(payload.projectVolume);
            break;

        case ProjectVolumeConstants.ADD_PENDING_PROJECT_VOLUME:
            addPending(payload.projectVolume);
            break;

        case ProjectVolumeConstants.REMOVE_PENDING_PROJECT_VOLUME:
            removePending(payload.projectVolume);
            break;

        case ProjectVolumeConstants.EMIT_CHANGE:
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

