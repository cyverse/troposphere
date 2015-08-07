define(function (require) {

  var ModalHelpers = require('components/modals/ModalHelpers'),
    VersionInformationModal = require('components/modals/VersionInformationModal.react');

  return {

    showVersion: function () {
      var props = {
        header: "Atmosphere Version"
      };

      ModalHelpers.renderModal(VersionInformationModal, props, function () {
      });
    }

  };

});
