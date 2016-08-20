import Utils from './Utils';
import NotificationController from 'controllers/NotificationController';
import ProviderMachineConstants from 'constants/ProviderMachineConstants';
import stores from 'stores';

export default {

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    update: function(machine, newAttributes) {
        if(!machine) throw new Error("Missing ProviderMachine");

        if(!newAttributes) throw new Error("No attributes to be updated");

        machine.set(newAttributes);
        Utils.dispatch(ProviderMachineConstants.UPDATE_PROVIDER_MACHINE, machine);

        machine.save(newAttributes, {
            patch:true,
        }).done(function(){
          stores.ProviderMachineStore.removeCache(machine);
          Utils.dispatch(ProviderMachineConstants.UPDATE_PROVIDER_MACHINE, machine);
        }).fail(function(){
          var message = "Error updating ProviderMachine " + machine.get('name') + ".";
          NotificationController.error(null, message);
          Utils.dispatch(ProviderMachineConstants.REMOVE_PROVIDER_MACHINE, {machine: machine});
        }).always(function(){
          // todo: add a POLL_PROVIDER_MACHINE constant if you want this to work (also need
          // to add a handler in the ProviderMachineStore)
          //Utils.dispatch(ProviderMachineConstants.POLL_PROVIDER_MACHINE, {machine: machine});
        });
    },

    updateProviderMachineAttributes: function (machine, newAttributes) {
      //machine.set(newAttributes);
      //Utils.dispatch(ProviderMachineConstants.UPDATE_machine, {machine: machine});

      //machine.save().done(function(){
      //}).fail(function(){
      //  NotificationController.error(null, "Error updating ProviderMachine " + machine.get('name') + ".");
      //  Utils.dispatch(ProviderMachineConstants.UPDATE_machine, {machine: machine});
      //});
    },

    destroy: function (machine) {
      //var that = this;

      //var props = {
      //  machine: machine
      //};

      //ModalHelpers.renderModal(ProviderMachineDeleteModal, props, function(){
      //  Utils.dispatch(ProviderMachineConstants.REMOVE_machine, {machine: machine});

      //  machine.destroy().done(function(){
      //  }).fail(function(){
      //    var failureMessage = "Error deleting ProviderMachine " + machine.get('name') + ".";
      //    NotificationController.error(failureMessage);
      //    Utils.dispatch(ProviderMachineConstants.ADD_machine, {machine: machine});
      //  });

      //})
    }

}
