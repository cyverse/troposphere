Modals that use the Bootstrap Modal Mixin are implemented like so:

// Example Usage from http://bl.ocks.org/insin/raw/8449696/
render: function(){
  <div>
    ...custom components...
    <ExampleModal
       ref="modal"
       show={false}
       header="Example Modal"
       buttons={buttons}
       handleShow={this.handleLog.bind(this, 'Modal about to show', 'info')}
       handleShown={this.handleLog.bind(this, 'Modal showing', 'success')}
       handleHide={this.handleLog.bind(this, 'Modal about to hide', 'warning')}
       handleHidden={this.handleLog.bind(this, 'Modal hidden', 'danger')}
     >
       <p>I'm the content.</p>
       <p>That's about it, really.</p>
     </ExampleModal>
  </div>


// To show the modal, call this.refs.modal.show() from the parent component:
handleShowModal: function() {
  this.refs.modal.show();
}