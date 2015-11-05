
import React from 'react';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';

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

function getState() {
    return {
        name: null,
        description: null
    }
}

export default React.createClass({
      displayName: "TagCreateModal",

      mixins: [BootstrapModalMixin],

      propTypes: {
        initialTagName: React.PropTypes.string
      },

      isSubmittable: function () {
        var hasName = !!this.state.name;
        var hasDescription = !!this.state.description;
        return hasName && hasDescription;
      },

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function () {
        return {
          name: this.props.initialTagName,
          description: null
        }
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function () {
        this.hide();
      },

      confirm: function () {
        this.hide();
        this.props.onConfirm(this.state.name, this.state.description);
      },


      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onNameChange: function (e) {
        var newName = e.target.value;
        this.setState({name: newName});
      },

      onDescriptionChange: function (e) {
        var newDescription = e.target.value;
        this.setState({description: newDescription});
      },

      //
      // Render
      // ------
      //

      renderBody: function () {
        return (
          <div role='form'>

            <div className='form-group'>
              <label htmlFor='volumeName'>Tag Name</label>
              <input type="text"
                     className="form-control"
                     value={this.state.name}
                     onChange={this.onNameChange}
                />
            </div>

            <div className='form-group'>
              <label htmlFor='volumeSize'>Tag Description</label>
              <textarea id='project-description'
                        type='text'
                        className='form-control'
                        rows="7"
                        value={this.state.description}
                        onChange={this.onDescriptionChange}
                />
            </div>

          </div>
        );
      },

      render: function () {
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Create Tag</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}
                          disabled={!this.isSubmittable()}>
                    Create tag
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

});
