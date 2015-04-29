define(function (require) {

  var AppDispatcher = require('dispatchers/AppDispatcher'),
      Utils = require('./Utils'),
      NotificationController = require('controllers/NotificationController'),

      // Constants
      ProviderMachineConstants = require('constants/ProviderMachineConstants'),

      // Models
      ProviderMachine = require('models/Machine'),

      // Modals
      ModalHelpers = require('components/modals/ModalHelpers'),
      ProviderMachineEditModal = require('components/modals/provider_machine/ProviderMachineEditModal.react');

  return {

    // ------------------------
    // Standard CRUD Operations
    // ------------------------

    edit: function (machine, application) {
      var that = this;

      var modal = ProviderMachineEditModal({machine: machine, application: application});

      ModalHelpers.renderModal(modal, function(version, end_date, uncopyable, application, licenses, memberships){
        //TODO: Add these values into the machine!
        machine.save().done(function(){
          Utils.dispatch(ProviderMachineConstants.UPDATE_MACHINE, {machine: machine});
        }).fail(function(){
          var message = "Error creating ProviderMachine " + machine.get('name') + ".";
          NotificationController.error(null, message);
          Utils.dispatch(ProviderMachineConstants.REMOVE_MACHINE, {machine: machine});
        });
      })

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

