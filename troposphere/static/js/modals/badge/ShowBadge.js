define(function (require) {
  "use strict";

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      FeedbackModal = require('components/modals/FeedbackModal.react'),
      BadgeModal = require('components/modals/BadgeModal.react');
  return {

    ShowBadge: function(badge){
      var modal = BadgeModal({
        badge: badge
      });

      ModalHelpers.renderModal(modal);
    }

  };

});
