/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    '../instance_launch/ProjectSelect.react',
    'components/common/Glyphicon.react'
  ],
  function (React, Backbone, BootstrapModalMixin, ProjectSelect, Glyphicon) {

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

      renderResource: function(resource){
        return (
          <li key={resource.id}><strong>{resource.get('name')}</strong></li>
        );
      },

      renderBody: function(){
        return (
          <div role='form'>

            <div className='form-group'>

              <p className='alert alert-danger'>
                <Glyphicon name='warning-sign'/>
                <strong>WARNING</strong>
                {
                  ' This action is permanent and CANNOT be undone.'
                }
              </p>

              <p>If you proceed, the following resources and all data on them will be destroyed:</p>
              <ul>
                {this.props.resources.map(this.renderResource)}
              </ul>
              <p>{"Would you still like to delete these resources?"}</p>
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
                    Yes, delete the resources
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
