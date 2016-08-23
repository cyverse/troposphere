import actions from 'actions';
import ModalHelpers from 'components/modals/ModalHelpers';
import TagCreateModal from 'components/modals/tag/TagCreateModal.react';

export default {
    create_AddToInstance: function (initialTagName, instance) {
      var props = {
        initialTagName: initialTagName
      };

      ModalHelpers.renderModal(TagCreateModal, props, function (name, description) {
        actions.TagActions.create_AddToInstance({
          name: name,
          description: description,
          instance: instance
        });
      });
    }
};
