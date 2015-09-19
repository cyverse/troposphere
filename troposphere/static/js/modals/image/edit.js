define(function (require) {
  "use strict";

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      FeedbackModal = require('components/modals/FeedbackModal.react'),
      ImageEditModal = require('components/modals/ImageEditModal.react');

  return {

    edit: function(image){
      ModalHelpers.renderModal(ImageEditModal, {image:image}, function(){});
    }

  };

});
