define(
  [
    'react',
    './CommonHelpers',
    'components/modals/CancelConfirmModal.react',
    'components/modals/ProjectMoveResourceModal.react',
    'components/modals/ProjectDeleteResourceModal.react',
    'components/modals/ProjectCreateModal.react',
    'components/modals/ProjectRemoveResourceModal.react',
    'components/modals/ProjectDeleteConditionsModal.react'
  ],
  function (React, CommonHelpers, CancelConfirmModal, ProjectMoveResourceModal, ProjectDeleteResourceModal, ProjectCreateModal, ProjectRemoveResourceModal, ProjectDeleteConditionsModal) {

    return {

      create: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var modal = ProjectCreateModal({
          header: "Create Project",
          confirmButtonMessage: "Create",
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      destroy: function (payload, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var project = payload.project;

        var body = 'Are you sure you would like to delete project "' + project.get('name') + '"?';

        var modal = CancelConfirmModal({
          header: "Delete Project",
          confirmButtonMessage: "Delete project",
          body: body,
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      moveResources: function(payload, options){
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var resources = payload.resources;
        var currentProject = payload.currentProject;

        var modal = ProjectMoveResourceModal({
          header: "Move Resources",
          confirmButtonMessage: "Move resources",
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel,
          currentProject: currentProject,
          resources: resources
        });

        CommonHelpers.renderComponent(modal);
      },

      removeResources: function(payload, options){
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var resources = payload.resources;
        var project = payload.project;

        var modal = ProjectRemoveResourceModal({
          header: "Remove Resources",
          confirmButtonMessage: "Remove resources",
          project: project,
          resources: resources,
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      },

      deleteResources: function(payload, options) {
        if (!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var resources = payload.resources;

        var modal = ProjectDeleteResourceModal({
          header: "Delete Resources",
          confirmButtonMessage: "Delete resources",
          onConfirm: options.onConfirm,
          onCancel: CommonHelpers.onCancel,
          handleHidden: CommonHelpers.onCancel,
          resources: resources
        });

        CommonHelpers.renderComponent(modal);
      },

      explainProjectDeleteConditions: function(){

        var modal = ProjectDeleteConditionsModal({
          header: "Project Delete Conditions",
          confirmButtonMessage: "Okay",
          handleHidden: CommonHelpers.onCancel
        });

        CommonHelpers.renderComponent(modal);
      }

    };

  });
