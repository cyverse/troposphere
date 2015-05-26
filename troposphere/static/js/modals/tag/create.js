define(function (require) {
  'use strict';

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      TagCreateModal = require('components/modals/tag/TagCreateModal.react');

  return {

    create: function(initialTagName){

      var modal = TagCreateModal({
        initialTagName: initialTagName
      });

      ModalHelpers.renderModal(modal, function(name, description){
        actions.TagActions.create({
          name: name,
          description: description
        });
      });
    }

  };

});
