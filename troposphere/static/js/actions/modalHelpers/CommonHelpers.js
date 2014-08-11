define(
  [
    'react'
  ],
  function (React) {

    return {

      onCancel: function(){
        // Important! We need to un-mount the component so it un-registers from Stores and
        // also so that we can relaunch it again later.
        React.unmountComponentAtNode(document.getElementById('modal'));
      },

      renderComponent: function(modal){
        React.renderComponent(modal, document.getElementById('modal'));
      }

    }

  });
