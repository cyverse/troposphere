import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import ExternalLinkCreateModal from 'components/modals/link/ExternalLinkCreateModal.react';

export default {

    create: function (initialExternalLinkName) {
      var props = {
        initialExternalLinkName: initialExternalLinkName
      };

      ModalHelpers.renderModal(ExternalLinkCreateModal, props, function (name, description, link) {
        actions.ExternalLinkActions.create({
          title: name,
          description: description,
          link: link
        });
      });
    }
};
