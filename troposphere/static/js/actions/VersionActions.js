define(function (require) {

  var React = require('react'),
      AppDispatcher = require('dispatchers/AppDispatcher'),
      VersionInformationModal = require('components/modals/VersionInformationModal.react');

  return {

    showVersion: function (volume) {

      var onClose = function(){
        // Important! We need to un-mount the component so it un-registers from Stores and
        // also so that we can relaunch it again later.
        React.unmountComponentAtNode(document.getElementById('modal'));
      };

      var headerMessage = "Atmosphere Version";

      var modal = VersionInformationModal({
        header: headerMessage,
        onClose: onClose,
        handleHidden: onClose
      });

      React.render(modal, document.getElementById('modal'));
    }

  };

});
