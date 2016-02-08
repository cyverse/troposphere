define(function (require) {
  'use strict';

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    ExternalLinkCreateModal = require('components/modals/link/ExternalLinkCreateModal.react');

  return {

    create: function (initialExternalLinkName) {
      var props = {
        initialExternalLinkName: initialExternalLinkName
      };

      ModalHelpers.renderModal(ExternalLinkCreateModal, props, function (name, description, link) {
        actions.ExternalLinkActions.create({
          title: name,
          description: description,
          link: link
        });
      });
    }

  };

});
