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

    edit: function (project) {
      var that = this;

      var modal = ProviderMachineEditModal();

      ModalHelpers.renderModal(modal, function(name, description){

        var machine = new ProviderMachine({
          name: name,
          description: description
        });

        Utils.dispatch(ProviderMachineConstants.ADD_MACHINE, {machine: machine});

        machine.save().done(function(){
          Utils.dispatch(ProviderMachineConstants.UPDATE_MACHINE, {machine: machine});
        }).fail(function(){
          var message = "Error creating ProviderMachine " + machine.get('name') + ".";
          NotificationController.error(null, message);
          Utils.dispatch(ProviderMachineConstants.REMOVE_MACHINE, {machine: machine});
        });
      })

    },

    updateProviderMachineAttributes: function (project, newAttributes) {
      var that = this;

      //project.set(newAttributes);
      //Utils.dispatch(ProviderMachineConstants.UPDATE_PROJECT, {project: project});

      //project.save().done(function(){
      //}).fail(function(){
      //  NotificationController.error(null, "Error updating ProviderMachine " + project.get('name') + ".");
      //  Utils.dispatch(ProviderMachineConstants.UPDATE_PROJECT, {project: project});
      //});
    },

    destroy: function (project) {
      //var that = this;

      //var modal = ProviderMachineDeleteModal({
      //  project: project
      //});

      //ModalHelpers.renderModal(modal, function(){
      //  Utils.dispatch(ProviderMachineConstants.REMOVE_PROJECT, {project: project});

      //  project.destroy().done(function(){
      //  }).fail(function(){
      //    var failureMessage = "Error deleting ProviderMachine " + project.get('name') + ".";
      //    NotificationController.error(failureMessage);
      //    Utils.dispatch(ProviderMachineConstants.ADD_PROJECT, {project: project});
      //  });

      //})
    }


  };

