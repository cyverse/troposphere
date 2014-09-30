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

      isSubmittable: function(){
        var isAllowedToDeleteResources = !!this.state.userHasGrantedPermissionToDeleteResources;
        return isAllowedToDeleteResources;
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

      renderResources: function(resource){
        return (
          <li key={resource.id}>{resource.get('name')}</li>
        );
      },

      renderBody: function(){
        return (
          <form role='form'>

            <div className='form-group'>
              <label htmlFor='volumeSize'>Resources to Delete</label>
              <p>The following resources will be deleted.  This CAN NOT be undone.</p>
              <ul>
                {this.props.resources.map(this.renderResource)}
              </ul>
            </div>

          </form>
        );
      },

      render: function () {
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Delete Resources</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                    Delete resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
