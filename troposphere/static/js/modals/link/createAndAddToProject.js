define(function (require) {
  'use strict';

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    ExternalLinkCreateModal = require('components/modals/link/ExternalLinkCreateModal.react');

  return {

    createAndAddToProject: function (initialExternalLinkName, project) {
      var props = {
        initialExternalLinkName: initialExternalLinkName
      };

      ModalHelpers.renderModal(ExternalLinkCreateModal, props, function (name, description, link) {
        actions.ExternalLinkActions.createAndAddToProject({
          title: name,
          description: description,
          link: link,
          project: project
        });
      });
    }

  };

});
