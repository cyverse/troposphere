define(function (require) {
  'use strict';

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      TagCreateModal = require('components/modals/tag/TagCreateModal.react');

  return {

    create: function(initialTagName){

      var props = {
        initialTagName: initialTagName
      };

      ModalHelpers.renderModal(TagCreateModal, null, function(name, description){
        actions.TagActions.create({
          name: name,
          description: description
        });
      });
    }

  };

});
