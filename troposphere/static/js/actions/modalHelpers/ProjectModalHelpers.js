define(
  [
    'react',
    './CommonHelpers',
    'components/modals/CancelConfirmModal.react',
    'components/modals/ProjectCreateModal.react'
  ],
  function (React, CommonHelpers, CancelConfirmModal, ProjectCreateModal) {

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
      }

    };

  });
