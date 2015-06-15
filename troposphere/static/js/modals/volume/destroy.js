define(function (require) {

  var actions = require('actions'),
      stores = require('stores'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      VolumeDeleteModal = require('components/modals/volume/VolumeDeleteModal.react'),
      ExplainVolumeDeleteConditionsModal = require('components/modals/volume/ExplainVolumeDeleteConditionsModal.react'),
      Router = require('Router');

  return {

    destroy: function(payload, options){
      if(!payload.project) throw new Error("Missing project");
      if(!payload.volume) throw new Error("Missing volume");

      var project = payload.project,
          volume = payload.volume,
          instanceUUID = volume.get('attach_data').instance_id,
          isAttached = !!instanceUUID,
          ModalComponent,
          props;

      if(isAttached){
        ModalComponent = ExplainVolumeDeleteConditionsModal;
        props = {
          volume: volume,
          instance: stores.InstanceStore.getAll().findWhere({uuid: instanceUUID})
        };
      }else{
        ModalComponent = VolumeDeleteModal;
        props = {
          volume: volume
        };
      }

      ModalHelpers.renderModal(ModalComponent, props, function () {
        if(isAttached) return;
        actions.VolumeActions.destroy({
          project: project,
          volume: volume
        });
        Router.getInstance().transitionTo("project-resources", {projectId: project.id});
      })
    }
  };

});
