define(function (require) {

  var React = require('react/addons'),
    BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react');

  // Example Usage from http://bl.ocks.org/insin/raw/8449696/
  // render: function(){
  // <div>
  //   ...custom components...
  //   <ExampleModal
  //      ref="modal"
  //      show={false}
  //      header="Example Modal"
  //      buttons={buttons}
  //      handleShow={this.handleLog.bind(this, 'Modal about to show', 'info')}
  //      handleShown={this.handleLog.bind(this, 'Modal showing', 'success')}
  //      handleHide={this.handleLog.bind(this, 'Modal about to hide', 'warning')}
  //      handleHidden={this.handleLog.bind(this, 'Modal hidden', 'danger')}
  //    >
  //      <p>I'm the content.</p>
  //      <p>That's about it, really.</p>
  //    </ExampleModal>
  // </div>
  //

  // To show the modal, call this.refs.modal.show() from the parent component:
  // handleShowModal: function() {
  //   this.refs.modal.show();
  // }

  return React.createClass({
    displayName: "BootstrapModal",

    mixins: [BootstrapModalMixin],

    render: function () {
      var buttons = this.props.buttons.map(function (button) {
        return (
          <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler}>
            {button.text}
          </button>
        );
      });

      return (
        <div className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                {this.renderCloseButton()}
                <strong>{this.props.header}</strong>
              </div>
              <div className="modal-body">
                {this.props.children}
              </div>
              <div className="modal-footer">
                {buttons}
              </div>
            </div>
          </div>
        </div>
      );
    }

  });

});
