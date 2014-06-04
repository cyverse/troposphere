define(
  [
    'dispatchers/app_dispatcher',
    'constants/ProjectConstants',
    'components/modals/CancelConfirmModal.react',
    'react'
  ],
  function (AppDispatcher, ProjectConstants, BootstrapModal, CancelConfirmModal, React) {

    return {
      create: function (project) {
        AppDispatcher.handleRouteAction({
          actionType: ProjectConstants.PROJECT_CREATE,
          model: project
        });
      },

      destroy: function (project) {

        var onConfirm = function () {
          console.log('woo! try delete project!');
          AppDispatcher.handleRouteAction({
            actionType: ProjectConstants.PROJECT_DESTROY,
            model: project
          });
        };

        var body = 'Are you sure you would like to delete project "' + project.get('name') + '"?';

        var modal = CancelConfirmModal({
          header: "Delete Project",
          confirmButtonMessage: "Delete project",
          onConfirm: onConfirm,
          body: body
        });

        React.renderComponent(modal, document.getElementById('modal'));

      }
    };

  });
