import React from 'react';
import $ from 'jquery';
import stores from 'stores';
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
        var tagExists = !!this.state.tagExists;
        return hasName && hasDescription && !tagExists;
      },

      componentDidMount: function (){
        if (this.state.name) {
          let lower = this.state.name.toLowerCase();
          let tags = stores.TagStore.getAll().filter(function (tag) {
            return tag.get('name').toLowerCase() === lower;
          });
          if(tags.length > 0){
            this.setState({tagExists: true, existsText: "Tag " + this.state.name + " already exists"});
          }
          else{
            this.setState({tagExists: false, existsText: ""});
          }
        }
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
        this.props.onConfirm($.trim(this.state.name), this.state.description);
      },


      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onNameChange: function (e) {
        var newName = e.target.value;
        this.setState({name: newName});
        if (newName) {
          let lower = $.trim(newName.toLowerCase());
          let tags = stores.TagStore.getAll().filter(function (tag) {
            return tag.get('name').toLowerCase() === lower;
          });
          if(tags.length > 0){
            this.setState({tagExists: true, existsText: "Tag with name \"" + newName + "\" already exists"});
          }
          else{
            this.setState({tagExists: false, existsText: ""});
          }
        }
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
        var formattedExistsText = <p className="no-results text-danger">{this.state.existsText}</p>
        return (
          <div role='form'>

            <div className='form-group'>
              <label htmlFor='volumeName'>Tag Name</label>
              <input type="text"
                     className="form-control"
                     value={this.state.name}
                     onChange={this.onNameChange}
                />
              {formattedExistsText}
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
        var footerExistsText;

        if(this.state.tagExists){
          footerExistsText = <p className="text-danger">Tag can not be created. Please fix errors above.</p>;
        }

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
                  {footerExistsText}
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
