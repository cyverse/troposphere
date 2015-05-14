define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      Utils = require('./Utils'),
      NotificationController = require('controllers/NotificationController'),

      // Constants
      ProviderMachineConstants = require('constants/ProviderMachineConstants'),

      // Models
      ProviderMachine = require('models/ProviderMachine'),

      // Modals
      ModalHelpers = require('components/modals/ModalHelpers'),
      ProviderMachineEditModal = require('components/modals/provider_machine/ProviderMachineEditModal.react');

  return {

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    update: function(machine, newAttributes) {
        if(!machine) throw new Error("Missing ProviderMachine");
        if(!newAttributes) throw new Error("No attributes to be updated");
        
        machine.set(newAttributes);
        Utils.dispatch(ProviderMachineConstants.UPDATE_PROVIDER_MACHINE, {machine: machine});
        //TODO: 
        machine.save(newAttributes, {
            patch:true,
        }).done(function(){
          // UPDATE_MACHINE here if we do NOT want 'optimistic updating'
          // Othewise, do nothing..
        }).fail(function(){
          var message = "Error creating ProviderMachine " + machine.get('name') + ".";
          NotificationController.error(null, message);
          Utils.dispatch(ProviderMachineConstants.REMOVE_PROVIDER_MACHINE, {machine: machine});
        }).always(function(){
          // todo: add a POLL_PROVIDER_MACHINE constant if you want this to work (also need
          // to add a handler in the ProviderMachineStore)
          //Utils.dispatch(ProviderMachineConstants.POLL_PROVIDER_MACHINE, {machine: machine});
        });
    },

    edit: function (machine, application) {
      var that = this;

      var modal = ProviderMachineEditModal({machine: machine, application: application});

      ModalHelpers.renderModal(modal, function(version, end_date, uncopyable, application, licenses, memberships){
        if (end_date !== null) {
            end_date = new Date(Date.parse(end_date)).toISOString()
        }
        that.update(machine, {
            version:version,
            end_date: end_date,
            allow_imaging: uncopyable,
            application: application,
            licenses: licenses,
            memberships: memberships
        });
      });

    },

    updateProviderMachineAttributes: function (machine, newAttributes) {
      var that = this;

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

      //var modal = ProviderMachineDeleteModal({
      //  machine: machine
      //});

      //ModalHelpers.renderModal(modal, function(){
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

});

