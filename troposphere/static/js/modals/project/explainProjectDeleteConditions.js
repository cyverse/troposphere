define(function (require) {

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    ProjectDeleteConditionsModal = require('components/modals/project/ProjectDeleteConditionsModal.react');

  return {
    explainProjectDeleteConditions: function () {
      ModalHelpers.renderModal(ProjectDeleteConditionsModal, null, function () {
      });
    }
  }

});
