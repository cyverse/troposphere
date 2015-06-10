define(
  [
    'react'
  ],
  function (React) {

    function onCancel(){
      // Important! We need to un-mount the component so it un-registers from Stores and
      // also so that we can relaunch it again later.
      React.unmountComponentAtNode(document.getElementById('modal'));
    }

    return {

      renderModal: function(ModalComponent, props, cb){
        props = props || {};
        var modal = React.createFactory(ModalComponent)(props);
        modal.props.onConfirm = cb;
        modal.props.onCancel = onCancel;
        modal.props.handleHidden = onCancel;

        React.render(modal, document.getElementById('modal'));
      }

    }

  });
