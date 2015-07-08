define(function (require) {
  "use strict";

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      FeedbackModal = require('components/modals/FeedbackModal.react'),
      MyBadgeModal = require('components/modals/MyBadgeModal.react');
  return {

    ShowMyBadge: function(badge){

      var modal = MyBadgeModal({
        badge: badge
      });

      ModalHelpers.renderModal(modal, function(input){
        console.log(input);
      });
    }

  };

});
