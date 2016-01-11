define(function (require) {

  var actions = require('actions'),
    stores = require('stores'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    ExternalLinkDeleteModal = require('components/modals/link/ExternalLinkDeleteModal.react'),
    Router = require('Router');

  return {

    destroy: function (payload, options) {
      if (!payload.project) throw new Error("Missing project");
      if (!payload.link) throw new Error("Missing link");

      var project = payload.project,
        link = payload.link,
        ModalComponent,
        props;

      ModalComponent = ExternalLinkDeleteModal;
      props = {
        link: link
      };

      ModalHelpers.renderModal(ModalComponent, props, function () {
        actions.ExternalLinkActions.destroy({
          project: project,
          link: link
        });
        Router.getInstance().transitionTo("project-resources", {projectId: project.id});
      })
    }
  };

});
