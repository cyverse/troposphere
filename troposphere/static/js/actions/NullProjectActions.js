import Backbone from "backbone";

import Utils from "./Utils";
import actions from "actions";
import context from "context";
import stores from "stores";

// Constants
import NullProjectInstanceConstants from "constants/NullProjectInstanceConstants";
import NullProjectVolumeConstants from "constants/NullProjectVolumeConstants";
import ProjectInstanceConstants from "constants/ProjectInstanceConstants";
import ProjectVolumeConstants from "constants/ProjectVolumeConstants";

// Models
import Instance from "models/Instance";
import Volume from "models/Volume";

// Modals
import ModalHelpers from "components/modals/ModalHelpers";
import NullProjectMoveAttachedVolumesModal from "components/modals/nullProject/NullProjectMoveAttachedVolumesModal";
import NullProjectMigrateResourceModal from "components/modals/nullProject/NullProjectMigrateResourceModal";


//
// Module
//
export default {

    _migrateResourceIntoProject: function(resource, project) {
        actions.ProjectActions.addResourceToProject(resource, project);

        if (resource instanceof Instance) {
            Utils.dispatch(NullProjectInstanceConstants.REMOVE_INSTANCE_FROM_NULL_PROJECT, {
                instance: resource
            });
        } else if (resource instanceof Volume) {
            Utils.dispatch(NullProjectVolumeConstants.REMOVE_VOLUME_FROM_NULL_PROJECT, {
                volume: resource
            });
        }
    },

    _migrateResourceIntoRealProject: function(resource, oldProject, newProject) {
        actions.ProjectActions.addResourceToProject(resource, newProject);

        if (oldProject) {
            if (resource instanceof Instance) {
                Utils.dispatch(ProjectInstanceConstants.REMOVE_PROJECT_INSTANCE, {
                    instance: resource,
                    project: oldProject
                });
            } else if (resource instanceof Volume) {
                Utils.dispatch(ProjectVolumeConstants.REMOVE_PROJECT_VOLUME, {
                    volume: resource,
                    project: oldProject
                });
            }
        }
    },

    // ------------------------
    // Exposed Operations
    // ------------------------

    // synchronize project resource state
    // 1. If resource not in a project, force user to put it into one
    // 2. If volume is attached
    // Uh oh!  Looks like you have some resources that aren't in a project.
    //
    // This can occur the first time you use
    // the new Atmosphere interface, or by switching back and forth between the old and new UI
    //
    moveAttachedVolumesIntoCorrectProject: function() {
        var instances = stores.InstanceStore.getAll(),
            volumes = stores.VolumeStore.getAll(),
            volumesInWrongProject = [];

        // Move volumes into correct project
        volumes.each(function(volume) {
            var volumeProjectId = (volume.get("project")) ? volume.get("project").id : -1,
                volumeProject = stores.ProjectStore.get(volumeProjectId),
                instanceUUID = volume.get("attach_data").instance_id,
                instance,
                instanceProjectId,
                project;

            if (instanceUUID) {
                instance = instances.findWhere({
                    uuid: instanceUUID
                });

                if (!instance) {
                    /* eslint-disable no-console */
                    console.warn("Instance with uuid: " +
                                 instanceUUID +
                                 " was not found.");
                    /* eslint-enable no-console */
                    return;
                }

                instanceProjectId = instance.get("project").id;
                if (volumeProjectId !== instanceProjectId) {
                    project = stores.ProjectStore.get(instanceProjectId);
                    if(volumeProject == null || project == null) {
                        // Don't do anything if the projects haven't loaded from the store
                        return;
                    }
                    this._migrateResourceIntoRealProject(volume, volumeProject, project);
                    volumesInWrongProject.push({
                        volume: volume,
                        instance: instance,
                        oldProject: volumeProject,
                        newProject: project
                    })
                }
            }
        }.bind(this));

        // Let the user know what we just did
        if (volumesInWrongProject.length > 0) {
            var props = {
                movedVolumesArray: volumesInWrongProject,
                backdrop: "static"
            };

            ModalHelpers.renderModal(NullProjectMoveAttachedVolumesModal, props, function() {});
        }
    },
    saveResourcesToProjects: function(project_resource_list) {
        let that = this;
        project_resource_list.forEach(function(project_resource) {
            that._migrateResourceIntoProject(
                project_resource.resource, project_resource.project);
        });
    },
    migrateResourcesIntoProject: function(nullProject) {
        var instances = nullProject.get("instances"),
            volumes = nullProject.get("volumes"),
            resources = new Backbone.Collection(),
            that = this;
        let current_user = context.profile.get('username');

        instances.each(function(instance) {
            if(instance.get('user').username == current_user) {
                resources.push(instance);
            }
        });

        volumes.each(function(volume) {
            if(volume.get('user').username == current_user) {
                resources.push(volume);
            }
        });

        if (resources.length > 0) {

            var props = {
                resources: resources,
                backdrop: "static"
            };

            ModalHelpers.renderModal(NullProjectMigrateResourceModal, props, function(project_resource_list) {
                that.saveResourcesToProjects(project_resource_list);
        });
        } else {
            that.moveAttachedVolumesIntoCorrectProject();
        }
    }

};
