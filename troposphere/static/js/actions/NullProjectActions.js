
import AppDispatcher from 'dispatchers/AppDispatcher';
import Backbone from 'backbone';
import stores from 'stores';
import NotificationController from 'controllers/NotificationController';
import Router from '../Router';
import Utils from './Utils';
import actions from 'actions';

// Constants
import NullProjectInstanceConstants from 'constants/NullProjectInstanceConstants';
import NullProjectVolumeConstants from 'constants/NullProjectVolumeConstants';
import ProjectInstanceConstants from 'constants/ProjectInstanceConstants';
import ProjectVolumeConstants from 'constants/ProjectVolumeConstants';
import ProjectConstants from 'constants/ProjectConstants';

// Models
import Project from 'models/Project';
import Instance from 'models/Instance';
import Volume from 'models/Volume';

// Modals
import ModalHelpers from 'components/modals/ModalHelpers';
import NullProjectMoveAttachedVolumesModal from 'components/modals/nullProject/NullProjectMoveAttachedVolumesModal.react';
import NullProjectMigrateResourceModal from 'components/modals/nullProject/NullProjectMigrateResourceModal.react';

//
// Module
//

export default {

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    _migrateResourceIntoProject: function (resource, project) {
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

    _migrateResourceIntoRealProject: function (resource, oldProject, newProject) {
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

    _migrateResourcesIntoProject: function (resources, project) {
      resources.map(function (resource) {
        this._migrateResourceIntoProject(resource, project);
      }.bind(this));

      Router.getInstance().transitionTo("project-resources", {projectId: project.id});
    },

    // synchronize project resource state
    // 1. If resource not in a project, force user to put it into one
    // 2. If volume is attached
    // Uh oh!  Looks like you have some resources that aren't in a project.
    //
    // This can occur the first time you use
    // the new Atmosphere interface, or by switching back and forth between the old and new UI
    //
    moveAttachedVolumesIntoCorrectProject: function () {
      var projects = stores.ProjectStore.getAll(),
        instances = stores.InstanceStore.getAll(),
        volumes = stores.VolumeStore.getAll(),
        volumesInWrongProject = [];

      // Move volumes into correct project
      volumes.each(function (volume) {
        var volumeProjectId = volume.get('projects')[0],
          volumeProject = stores.ProjectStore.get(volumeProjectId),
          instanceUUID = volume.get('attach_data').instance_id,
          instance,
          instanceProjectId,
          project;

        if (instanceUUID) {
          instance = instances.findWhere({uuid: instanceUUID});

          if (!instance) {
            console.warn("Instance with uuid: " + instanceUUID + " was not found.");
            return;
          }

          instanceProjectId = instance.get('projects')[0];
          if (volumeProjectId !== instanceProjectId) {
            project = stores.ProjectStore.get(instanceProjectId);
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
          backdrop: 'static'
        };

        ModalHelpers.renderModal(NullProjectMoveAttachedVolumesModal, props, function () {
        });
      }
    },

    migrateResourcesIntoProject: function (nullProject) {
      var instances = nullProject.get('instances'),
        volumes = nullProject.get('volumes'),
        resources = new Backbone.Collection(),
        that = this;

      instances.each(function (instance) {
        resources.push(instance);
      });

      volumes.each(function (volume) {
        resources.push(volume);
      });

      if (resources.length > 0) {

        var props = {
          resources: resources,
          backdrop: 'static'
        };

        ModalHelpers.renderModal(NullProjectMigrateResourceModal, props, function (params) {
          var resourcesClone = resources.models.slice(0);
          var project;

          if (params.projectName) {
            project = new Project({
              name: params.projectName,
              description: params.projectName,
              instances: [],
              volumes: []
            });

            Utils.dispatch(ProjectConstants.ADD_PROJECT, {project: project});

            project.save().done(function () {
              //NotificationController.success(null, "Project " + project.get('name') + " created.");
              Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
              that._migrateResourcesIntoProject(resourcesClone, project);
              that.moveAttachedVolumesIntoCorrectProject();
            }).fail(function () {
              var message = "Error creating Project " + project.get('name') + ".";
              NotificationController.error(null, message);
              Utils.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});
            });

          } else if (params.projectId && params.projects) {
            project = params.projects.get(params.projectId);
            that._migrateResourcesIntoProject(resourcesClone, project);
            that.moveAttachedVolumesIntoCorrectProject();
          } else {
            throw new Error("expected either projectName OR projectId and projects parameters")
          }
        })

      } else {
        that.moveAttachedVolumesIntoCorrectProject();
      }
    }

  };
