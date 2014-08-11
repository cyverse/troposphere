define(
  [
    'react',
    './CommonHelpers',
    'components/modals/CancelConfirmModal.react',
    'components/modals/ProjectMoveResourceModal.react'
  ],
  function (React, CommonHelpers, CancelConfirmModal, ProjectMoveResourceModal) {

    return {

      destroy: function (project, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var body = 'Are you sure you would like to delete project "' + project.get('name') + '"?';

        var modal = CancelConfirmModal({
          header: "Delete Project",
          confirmButtonMessage: "Delete project",
          onConfirm: options.onConfirm,
          body: body
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
      }

    };

  });
