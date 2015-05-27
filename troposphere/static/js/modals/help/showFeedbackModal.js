define(function (require) {
  "use strict";

  var actions = require('actions'),
      ModalHelpers = require('components/modals/ModalHelpers'),
      FeedbackModal = require('components/modals/FeedbackModal.react')
  return {

    showFeedbackModal: function(){

      var modal = FeedbackModal({
        header: "Send Feedback",
        confirmButtonMessage: "Send feedback"
      });

      ModalHelpers.renderModal(modal, function(feedback){

        actions.HelpActions.sendFeedback({
          feedback: feedback
        });
      });
    }

  };

});
