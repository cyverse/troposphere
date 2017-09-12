import VolumeConstants from "constants/VolumeConstants";
import ProjectVolumeConstants from "constants/ProjectVolumeConstants";
import Utils from "../Utils";
import Backbone from "backbone";
import ProjectVolume from "models/ProjectVolume";
import ProjectVolumeStore from "stores/ProjectVolumeStore";

export default {
    update: function(volume, newAttributes) {
        if (!volume)
            throw new Error("Missing volume");
        if (!newAttributes || (!newAttributes.name && !newAttributes.project))
            throw new Error("Expected name and/or project in attributes. received " + newAttributes)

        let project = newAttributes.project || volume.get("project");
        let name = newAttributes.name || volume.get("name");

        let originalVolume = volume.clone();
        let originalProject = originalVolume.get('project');

        volume.set(newAttributes);
        Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {
            volume: volume
        });

        let originalProjectVolume = ProjectVolumeStore.findOne({
            "project.id": originalProject.id,
            "volume.id": originalVolume.id
        });
        if (originalProjectVolume) {
            Utils.dispatch(ProjectVolumeConstants.REMOVE_PROJECT_VOLUME, { projectVolume: originalProjectVolume });
        }

        // Note this resource being added doesn't have an id. Its like a
        // pending resource. It will be removed, when we
        // fetchWhereNoCache() which syncs the project volume store with
        // the api.
        let projectVolume = new ProjectVolume({
            project: project instanceof Backbone.Model ? project.toJSON() : project,
            volume: volume.toJSON()
        });
        Utils.dispatch(ProjectVolumeConstants.ADD_PROJECT_VOLUME, { projectVolume: projectVolume });


        volume.save({
            name: name,
            project: project.id
        }, {
            patch: true,
            merge: true
        }).fail(function(response) {
            Utils.displayError({
                title: "Volume could not be updated",
                response: response
            });
        }).always(function() {
            Utils.dispatch(VolumeConstants.UPDATE_VOLUME, {
                volume: volume
            });
            Utils.dispatch(VolumeConstants.POLL_VOLUME, {
                volume: volume
            });

            // Once the volume has been saved, have the ProjectVolumeStore
            // repopulate it's models.
            ProjectVolumeStore.fetchWhereNoCache();
        });
    }
};
