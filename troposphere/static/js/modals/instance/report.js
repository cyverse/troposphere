define(function (require) {
  "use strict";

  var ModalHelpers = require('components/modals/ModalHelpers'),
      InstanceReportModal = require('components/modals/instance/InstanceReportModal.react'),
      actions = require('actions');

  return {

    report: function(params){
      if(!params.instance) throw new Error("Missing instance");

      var instance = params.instance,
          modal = InstanceReportModal({
            instance: instance
          });

      ModalHelpers.renderModal(modal, function (reportInfo) {
        actions.InstanceActions.report({
          instance: instance,
          reportInfo: reportInfo
        })
      })
    }

  };

});
