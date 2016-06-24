import AppDispatcher from 'dispatchers/AppDispatcher';
import Utils from './Utils';
import NotificationController from 'controllers/NotificationController';
import Router from '../Router';
import actions from 'actions';

// Constants
import Badges from "Badges";
import ProjectConstants from 'constants/ProjectConstants';
import NullProjectInstanceConstants from 'constants/NullProjectInstanceConstants';
import NullProjectVolumeConstants from 'constants/NullProjectVolumeConstants';

// Models
import ExternalLink from 'models/ExternalLink';
import Instance from 'models/Instance';
import Volume from 'models/Volume';
import Image from 'models/Image';
import Project from 'models/Project';

// Modals
import ModalHelpers from 'components/modals/ModalHelpers';
import ProjectReportResourceModal from 'components/modals/project/ProjectReportResourceModal.react';


export default {

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    create: function (params, onSuccess, onFailure) {
      if (!params.name) throw new Error("Missing name");
      if (!params.description) throw new Error("Missing description");

      var name = params.name,
        description = params.description;

      var project = new Project({
        name: name,
        description: description
      });


      Utils.dispatch(ProjectConstants.ADD_PROJECT, {project: project});

      project.save().done(function () {
        //NotificationController.success(null, "Project " + project.get('name') + " created.");
        actions.BadgeActions.checkOrGrant(Badges.FIRST_PROJECT_BADGE);
        Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
        if (onSuccess != null) {
          onSuccess(project);
        }

      }).fail(function () {
        var message = "Error creating Project " + project.get('name') + ".";
        NotificationController.error(null, message);
        Utils.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});
        if (onFailure != null) {
          onFailure(project);
        }
      });
    },

    updateProjectAttributes: function (project, newAttributes) {
      project.set(newAttributes);
      Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});

      project.save().done(function () {
        //NotificationController.success(null, "Project name updated.");
      }).fail(function () {
        NotificationController.error(null, "Error updating Project " + project.get('name') + ".");
        Utils.dispatch(ProjectConstants.UPDATE_PROJECT, {project: project});
      });
    },

    destroy: function (params) {
      if (!params.project) throw new Error("Missing project");
      var project = params.project;
      Utils.dispatch(ProjectConstants.REMOVE_PROJECT, {project: project});

      project.destroy().done(function () {
        //NotificationController.success(null, "Project " + project.get('name') + " deleted.");
      }).fail(function () {
        var failureMessage = "Error deleting Project " + project.get('name') + ".";
        NotificationController.error(failureMessage);
        Utils.dispatch(ProjectConstants.ADD_PROJECT, {project: project});
      });

      Router.getInstance().transitionTo("projects");
    },

    // ----------------------
    // Move Project Resources
    // ----------------------

    moveResources: function (params) {
      if (!params.newProject) throw new Error("Missing newProject");
      if (!params.resources) throw new Error("Missing resources");
      if (!params.currentProject) throw new Error("Missing currentProject");

      var that = this,
        newProject = params.newProject,
        resources = params.resources,
        currentProject = params.currentProject;

      resources.map(function (resource) {
        that.addResourceToProject(resource, newProject, {silent: false});
        that.removeResourceFromProject(resource, currentProject, {silent: false});
      });
      Utils.dispatch(ProjectConstants.EMIT_CHANGE);
    },

    // ----------------------------
    // Add/Remove Project Resources
    // ----------------------------

    addResourceToProject: function (resource, project, options) {
      // todo: settings projects here is a bad hack - it's because there are a
      // few places in the code that access instance/volume.get('projects')[0]
      // Instead we need to change those places to access a resources project
      // either through stores.ProjectInstanceStore or the route URL (getParams().projectId);
      resource.set('projects', [project.id]);

      if (resource instanceof Instance) {
        actions.ProjectInstanceActions.addInstanceToProject({
          project: project,
          instance: resource
        }, options);
      } else if (resource instanceof Volume) {
        actions.ProjectVolumeActions.addVolumeToProject({
          project: project,
          volume: resource
        }, options);
      } else if (resource instanceof ExternalLink) {
        actions.ProjectExternalLinkActions.addExternalLinkToProject({
          project: project,
          external_link: resource
        }, options);
      } else if (resource instanceof Image) {
        actions.ProjectImageActions.addImageToProject({
          project: project,
          image: resource
        }, options);
      } else {
        throw new Error("Unknown resource type");
      }
    },

    removeResourceFromProject: function (resource, project, options) {
      if (resource instanceof Instance) {
        actions.ProjectInstanceActions.removeInstanceFromProject({
          project: project,
          instance: resource
        }, options);
      } else if (resource instanceof Volume) {
        actions.ProjectVolumeActions.removeVolumeFromProject({
          project: project,
          volume: resource
        }, options);
      } else if (resource instanceof ExternalLink) {
        actions.ProjectExternalLinkActions.removeExternalLinkFromProject({
          project: project,
          external_link: resource
        }, options);
      } else if (resource instanceof Image) {
        actions.ProjectImageActions.removeImageFromProject({
          project: project,
          image: resource
        }, options);
      } else {
        throw new Error("Unknown resource type");
      }
    },

    removeResources: function (params) {
      if (!params.resources) throw new Error("Missing resources");
      if (!params.project) throw new Error("Missing params");

      var that = this,
        resources = params.resources,
        project = params.project;

      resources.map(function (resource) {
        that.removeResourceFromProject(resource, project);
        if (resource instanceof Instance) {
          Utils.dispatch(NullProjectInstanceConstants.ADD_INSTANCE_TO_NULL_PROJECT, {
            instance: resource
          });
        } else if (resource instanceof Volume) {
          Utils.dispatch(NullProjectVolumeConstants.ADD_VOLUME_TO_NULL_PROJECT, {
            volume: resource
          });
        } else if (resource instanceof ExternalLink) {
          //Removes the ExternalLink but does not destroy it.
          actions.ProjectExternalLinkActions.removeExternalLinkFromProject({
            project: project,
            external_link: resource
          });
        } else if (resource instanceof Image) {
          //Do NOT delete the image, just remove the image from the project.
          //TODO: Test this
          actions.ProjectImageActions.removeImageFromProject({
            project: project,
            image: resource
          });
        }
      });
      Utils.dispatch(ProjectConstants.EMIT_CHANGE);
    },

    // ------------------------
    // Delete Project Resources
    // ------------------------

    deleteResources: function (resources, project) {
      var that = this;

      // According to this line below the following functionality has been disabled!
      // components/projects/detail/resources/ButtonBar.react.js:25
      //
      // Further the modal below HAS BEEN DELETED :C
      // It can be scavenged from here:
      // 
      //    git show ca1a6ef18c:troposphere/static/js/actions/modalHelpers/ProjectModalHelpers.js
      //
      // Or:
      //    git log -G'ProjectDeleteResourceModal' -p
      //

      // let props = {
      //     resources: resources
      // };
      // let modal = ProjectDeleteResourceModal({
      //     resources: resources
      // };

      // ModalHelpers.renderModal(modal, props, function () {
      //   // We need to clone the array because we're going to be destroying
      //   // the model and that will cause it to be removed from the collection
      //   var clonedResources = resources.models.slice(0);

      //   clonedResources.map(function (resource) {
      //     that.deleteResource(resource, project, {silent: false});
      //   });

      //   Utils.dispatch(ProjectConstants.EMIT_CHANGE);
      // })
    },

    deleteResource: function (resource, project, options) {
      // todo: remove instance from project after deletion
      if (resource instanceof Instance) {
        actions.InstanceActions.destroy({
          instance: resource,
          project: project
        }, options);
      } else if (resource instanceof Volume) {
        actions.VolumeActions.destroy({
          volume: resource,
          project: project
        }, options);
      } else if (resource instanceof ExternalLink) {
        actions.ExternalLinkActions.destroy_noModal({
          external_link: resource,
          project: project
        }, options);
      } else if (resource instanceof Image) {
        actions.ProjectImageActions.removeImageFromProject({
          project: project,
          image: resource
        });
      } else {
        throw new Error("Unknown resource type");
      }
    },

    // ------------------------
    // Report Project Resources
    // ------------------------

    reportResources: function (project, resources) {
      var props = {
        project: project,
        resources: resources
      };

      ModalHelpers.renderModal(ProjectReportResourceModal, props, function () {
        // todo: report the resources
        alert("Report resources not yet implemented")
      });
    }

};
