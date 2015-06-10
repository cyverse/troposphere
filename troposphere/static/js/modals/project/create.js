define(function (require) {

  var actions = require('actions'),

      // Modals
      ModalHelpers = require('components/modals/ModalHelpers'),
      ProjectCreateModal = require('components/modals/project/ProjectCreateModal.react');

  return {

    create: function () {
      ModalHelpers.renderModal(ProjectCreateModal, null, function(name, description){
        actions.ProjectActions.create({
          name: name,
          description: description
        });
      })

    }

  };

});
