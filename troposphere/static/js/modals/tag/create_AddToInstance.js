define(function (require) {
  'use strict';

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      TagCreateModal = require('components/modals/tag/TagCreateModal.react');

  return {

    create_AddToInstance: function(initialTagName, instance){
      var props = {
        initialTagName: initialTagName
      };

      ModalHelpers.renderModal(TagCreateModal, props, function(name, description){
        actions.TagActions.create_AddToInstance({
          name: name,
          description: description,
          instance: instance
        });
      });
    }

  };

});
