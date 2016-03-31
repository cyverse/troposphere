import actions from 'actions';
import stores from 'stores';
import ModalHelpers from 'components/modals/ModalHelpers';
import ExternalLinkDeleteModal from 'components/modals/link/ExternalLinkDeleteModal.react';
import Router from 'Router';


export default {

    destroy: function (payload, options) {
      if (!payload.project) throw new Error("Missing project");
      if (!payload.external_link) throw new Error("Missing external_link");

      var project = payload.project,
        external_link = payload.external_link,
        ModalComponent,
        props;

      ModalComponent = ExternalLinkDeleteModal;
      props = {
        external_link: external_link
      };

      ModalHelpers.renderModal(ModalComponent, props, function () {
        actions.ExternalLinkActions.destroy({
          project: project,
          external_link: external_link
        });
        Router.getInstance().transitionTo("project-resources", {projectId: project.id});
      })
    }
  };
