define(function (require) {
  "use strict";

  var actions = require('actions'),
    ModalHelpers = require('components/modals/ModalHelpers'),
    FeedbackModal = require('components/modals/FeedbackModal.react');
  return {

    showFeedbackModal: function () {

      var props = {
        header: "Send Feedback",
        confirmButtonMessage: "Send feedback"
      };

      ModalHelpers.renderModal(FeedbackModal, props, function (feedback) {

        actions.HelpActions.sendFeedback({
          feedback: feedback
        });
      });
    }

  };

});
