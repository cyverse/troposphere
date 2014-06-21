define(
  [
    'react',
    'dispatchers/AppDispatcher',
    'components/modals/VersionInformationModal.react'
  ],
  function (React, AppDispatcher, VersionInformationModal) {

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

        React.renderComponent(modal, document.getElementById('modal'));
      }

    };

  });
