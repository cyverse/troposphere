/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'stores',
    '../instance_launch/IdentitySelect.react'
  ],
  function (React, BootstrapModalMixin, stores, IdentitySelect) {

    function getState() {
      var state = {
        providers: stores.ProviderStore.getAll(),
        identities: stores.IdentityStore.getAll(),

        volumeName: null,
        identityId: null
      };

      this.state = this.state || {};

      // Use provided volume name or default to nothing
      state.volumeName = this.state.volumeName || "";

      // Use provided volume size or default to 1 GB
      state.volumeSize = this.state.volumeSize || 1;

      // Use selected identity or default to the first one
      if (state.identities) {
        state.identityId = this.state.identityId || state.identities.first().id;
      }

      return state;
    }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      isSubmittable: function(){
        // Make sure the selected provider is not in maintenance
          var selectedIdentity = stores.IdentityStore.get(this.state.identityId);
          var isProviderInMaintenance = stores.MaintenanceMessageStore.isProviderInMaintenance(selectedIdentity.get('provider_id'));

          // Disable the launch button if the user hasn't provided a name, size or identity for the volume
          var hasProvider              = !!this.state.identityId;
          var hasName                  = !!this.state.volumeName;
          var hasSize                  = !!this.state.volumeSize;
          var providerNotInMaintenance = !isProviderInMaintenance;

        return hasProvider && hasName && hasSize && providerNotInMaintenance;
      },

      //
      // Mounting & State
      // ----------------
      //
      getInitialState: function(){
        return getState.apply(this);
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState.apply(this));
      },

      componentDidMount: function () {
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
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
        var identity = this.state.identities.get(this.state.identityId);
        this.props.onConfirm(this.state.volumeName, this.state.volumeSize, identity);
      },


      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onProviderIdentityChange: function(e){
        var newIdentityId = e.target.value;
        this.setState({identityId: newIdentityId});
      },

      onVolumeNameChange: function(e){
        var newVolumeName = e.target.value;
        this.setState({volumeName: newVolumeName});
      },

      onVolumeSizeChange: function(e){
        // todo: Don't let the user enter a value < 1, but doing it this way
        // doesn't let them hit backspace to remove the default 1 and start
        // typing a number.  Instead we should check for the onBlur event and
        // handle it then so it's only when they've left the input box.  But
        // probably better over all just to tell them the value has to be > 1
        // and don't magically change it for them.
        //if(e.target.value < 1) e.target.value = 1;
        var newVolumeSize = e.target.value;
        this.setState({volumeSize: newVolumeSize});
      },


      //
      // Render
      // ------
      //

      renderBody: function(){
        if(this.state.identities && this.state.providers){
          return (
            <form role='form'>

              <div className='form-group'>
                <label htmlFor='volumeName'>Volume Name</label>
                <input type="text" className="form-control" value={this.state.volumeName} onChange={this.onVolumeNameChange}/>
              </div>

              <div className='form-group'>
                <label htmlFor='volumeSize'>Volume Size</label>
                <input type="number" className="form-control" value={this.state.volumeSize} onChange={this.onVolumeSizeChange}/>
              </div>

              <div className='form-group'>
                <label htmlFor='identity'>Provider</label>
                <IdentitySelect
                    identityId={this.state.identityId}
                    identities={this.state.identities}
                    providers={this.state.providers}
                    onChange={this.onProviderIdentityChange}
                />
              </div>

            </form>
          );
        }else{
          return (
            <div className="loading"></div>
          );
        }
      },

      render: function () {
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Create Volume</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                    Create volume
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
