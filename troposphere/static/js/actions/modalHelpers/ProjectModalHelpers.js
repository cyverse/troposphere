define(
  [
    'react',
    './CommonHelpers',
    'components/modals/CancelConfirmModal.react'
  ],
  function (React, CommonHelpers, CancelConfirmModal) {

    return {

      destroy: function (project, options) {
        if(!options.onConfirm) throw new Error("Must supply options.onConfirm callback");

        var body = 'Are you sure you would like to delete project "' + project.get('name') + '"?';

        var modal = CancelConfirmModal({
          header: "Delete Project",
          confirmButtonMessage: "Delete project",
          onConfirm: options.onConfirm,
          //onCancel: CommonHelpers.onCancel,
          //handleHidden: CommonHelpers.onCancel,
          body: body
        });

        CommonHelpers.renderComponent(modal);
      }

    };

  });
