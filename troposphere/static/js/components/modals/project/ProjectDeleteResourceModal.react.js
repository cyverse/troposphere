/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'stores/ProjectStore',
    '../instance_launch/ProjectSelect.react'
  ],
  function (React, Backbone, BootstrapModalMixin, ProjectStore, ProjectSelect) {

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
        userHasGrantedPermissionToDeleteResources: true
      };
    }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function(){
        return getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function(){
        this.hide();
      },

      confirm: function () {
        this.hide();
        this.props.onConfirm();
      },


      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onPermissionChange: function(e){
        var newPermission = !this.state.userHasGrantedPermissionToDeleteResources;
        this.setState({userHasGrantedPermissionToDeleteResources: newPermission});
      },


      //
      // Render
      // ------
      //

      render: function () {
        // todo: If the user only has one project, provide an action to create another project

        var buttonArray = [
          {type: 'danger', text: 'Cancel', handler: this.cancel},
          {type: 'primary', text: this.props.confirmButtonMessage, handler: this.confirm}
        ];

        var buttons = buttonArray.map(function (button) {
          // Enable all buttons be default
          var isDisabled = false;

          // Disable the launch button if the user hasn't provided a name, size or identity for the volume
          var stateIsValid = this.state.userHasGrantedPermissionToDeleteResources;
          if(button.type === "primary" && !stateIsValid ) isDisabled = true;

          return (
            <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler} disabled={isDisabled}>
              {button.text}
            </button>
          );
        }.bind(this));

        var resourceNames = this.props.resources.map(function(resource){
          return (
            <li key={resource.id}>{resource.get('name')}</li>
          );
        });

        var content = (
          <form role='form'>

            <div className='form-group'>
              <label htmlFor='volumeSize'>Resources to Delete</label>
              <p>The following resources will be deleted.  This CAN NOT be undone.</p>
              <ul>
                {resourceNames}
              </ul>
            </div>

          </form>
        );

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>{this.props.header}</strong>
                </div>
                <div className="modal-body">
                  {content}
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
