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
        projects: stores.ProjectStore.getAll(),

        volumes: null,
        volumeName: null,
        identityId: null
      };

      this.state = this.state || {};

      // Use provided volume name or default to nothing
      state.volumeName = this.state.volumeName || "";

      // Use provided volume size or default to 1 GB
      state.volumeSize = Number(this.state.volumeSize) || 1;

      // Use selected identity or default to the first one
      if (state.identities) {
        state.identityId = this.state.identityId || state.identities.first().id;
      }

      if(state.projects){
        state.volumes = stores.VolumeStore.getAll(state.projects)
      }

      return state;
    }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      isSubmittable: function(){
        // Make sure the selected provider is not in maintenance
        var selectedIdentity = stores.IdentityStore.get(this.state.identityId);
        var isProviderInMaintenance = stores.MaintenanceMessageStore.isProviderInMaintenance(selectedIdentity.get('provider_id'));
        var volumes = this.state.volumes;

        // Disable the launch button if the user hasn't provided a name, size or identity for the volume
        var hasProvider              = !!this.state.identityId;
        var hasName                  = !!this.state.volumeName;
        var hasSize                  = !!this.state.volumeSize;
        var providerNotInMaintenance = !isProviderInMaintenance;
        var hasEnoughQuotaForStorage = this.hasEnoughQuotaForStorage(selectedIdentity, this.state.volumeSize, volumes);
        var hasEnoughQuotaForStorageCount = this.hasEnoughQuotaForStorageCount(selectedIdentity, volumes);

        return hasProvider && hasName && hasSize && providerNotInMaintenance && hasEnoughQuotaForStorage && hasEnoughQuotaForStorageCount;
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
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.VolumeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.VolumeStore.removeChangeListener(this.updateState);
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
        var newVolumeSize = Number(e.target.value);
        this.setState({volumeSize: newVolumeSize});
      },

      //
      // Helper Functions
      //

      hasEnoughQuotaForStorage: function(identity, size, volumes){
        var quota = identity.get('quota');
        var maximumAllowed = quota.storage;
        var projected = size;
        var currentlyUsed = identity.getStorageUsed(volumes);

        return (projected + currentlyUsed) <= maximumAllowed;
      },

      hasEnoughQuotaForStorageCount: function(identity, volumes){
        var quota = identity.get('quota');
        var maximumAllowed = quota.storage_count;
        var projected = 1;
        var currentlyUsed = identity.getStorageCountUsed(volumes);

        return (projected + currentlyUsed) <= maximumAllowed;
      },

      //
      // Render
      // ------
      //

      renderProgressBar: function(message, currentlyUsedPercent, projectedPercent, overQuotaMessage){
        var currentlyUsedStyle = { width: currentlyUsedPercent + "%" };
        var projectedUsedStyle = { width: projectedPercent + "%", opacity: "0.6" };
        var totalPercent = currentlyUsedPercent + projectedPercent;
        var barTypeClass;

        if(totalPercent <= 50){
          barTypeClass = "progress-bar-success";
        }else if(totalPercent <= 100){
          barTypeClass = "progress-bar-warning";
        }else{
          barTypeClass = "progress-bar-danger";
          projectedUsedStyle.width = (100 - currentlyUsedPercent) + "%";
          message = overQuotaMessage;
        }

        return (
          <div className="quota-consumption-bars">
            <div className="progress">
              <div className="value">{Math.round(currentlyUsedPercent + projectedPercent) + "%"}</div>
              <div className={"progress-bar " + barTypeClass} style={currentlyUsedStyle}></div>
              <div className={"progress-bar " + barTypeClass} style={projectedUsedStyle}></div>
            </div>
            <div>{message}</div>
          </div>
        );
      },

      renderStorageConsumption: function(identity, size, volumes){
        var quota = identity.get('quota');
        var maximumAllowed = quota.storage;
        var projected = size;
        var currentlyUsed = identity.getStorageUsed(volumes);

        // convert to percentages
        var projectedPercent = projected / maximumAllowed * 100;
        var currentlyUsedPercent = currentlyUsed / maximumAllowed * 100;

        var message = "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted GBs of Storage.";
        var overQuotaMessage = (
          <div>
            <strong>Storage quota exceeded.</strong>
            <span>{" Choose a smaller size or delete an existing volume."}</span>
          </div>
        );

        return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
      },

      renderStorageCountConsumption: function(identity, size, volumes){
        var quota = identity.get('quota');
        var maximumAllowed = quota.storage_count;
        var projected = 1;
        var currentlyUsed = identity.getStorageCountUsed(volumes);

        // convert to percentages
        var projectedPercent = projected / maximumAllowed * 100;
        var currentlyUsedPercent = currentlyUsed / maximumAllowed * 100;

        var message = "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted Volumes.";
        var overQuotaMessage = (
          <div>
            <strong>Volume quota exceeded.</strong>
            <span>{" You must delete an existing volume before creating a new one."}</span>
          </div>
        );

        return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
      },

      renderBody: function(){
        if(this.state.identities && this.state.providers && this.state.volumes){
          var volumes = this.state.volumes;
          var identity = this.state.identities.get(this.state.identityId);
          var size = this.state.volumeSize;

          return (
            <form role='form'>

              <div className="modal-section form-horizontal">
                <h4>Volume Details</h4>

                <div className='form-group'>
                  <label htmlFor='volumeName' className="col-sm-3 control-label">Volume Name</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" value={this.state.volumeName} onChange={this.onVolumeNameChange}/>
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='volumeSize' className="col-sm-3 control-label">Volume Size</label>
                  <div className="col-sm-9">
                    <input type="number" className="form-control" value={this.state.volumeSize} onChange={this.onVolumeSizeChange}/>
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='identity' className="col-sm-3 control-label">Provider</label>
                  <div className="col-sm-9">
                    <IdentitySelect
                        identityId={this.state.identityId}
                        identities={this.state.identities}
                        providers={this.state.providers}
                        onChange={this.onProviderIdentityChange}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4>Projected Resource Usage</h4>
                {this.renderStorageConsumption(identity, size, volumes)}
                {this.renderStorageCountConsumption(identity, size, volumes)}
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
