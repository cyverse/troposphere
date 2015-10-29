import actions from 'actions';
import stores from 'stores';
import ModalHelpers from 'components/modals/ModalHelpers';
import InstanceDeleteModal from 'components/modals/instance/InstanceDeleteModal.react';
import ExplainInstanceDeleteConditionsModal from 'components/modals/instance/ExplainInstanceDeleteConditionsModal.react';
import Router from 'Router';

export default {

    destroy: function (payload, options) {
      if (!payload.project) throw new Error("Missing project");
      if (!payload.instance) throw new Error("Missing instance");

      var project = payload.project,
        instance = payload.instance,
        attachedVolumes = stores.VolumeStore.getVolumesAttachedToInstance(instance),
        ModalComponent,
        props;

      if (attachedVolumes.length > 0) {
        ModalComponent = ExplainInstanceDeleteConditionsModal;
        props = {
          attachedVolumes: attachedVolumes,
          backdrop: 'static'
        };
      } else {
        ModalComponent = InstanceDeleteModal;
        props = {
          instance: payload.instance
        };
      }

      ModalHelpers.renderModal(ModalComponent, props, function () {
        if (attachedVolumes.length > 0) return;
        actions.InstanceActions.destroy(payload, options);
        Router.getInstance().transitionTo("project-resources", {projectId: project.id});
      })
    },

    destroy_noModal: function (payload, options) {
      actions.InstanceActions.destroy(payload, options);
    }

};
