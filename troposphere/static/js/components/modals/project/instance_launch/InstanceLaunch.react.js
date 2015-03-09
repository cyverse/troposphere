/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores',
    'components/modals/instance_launch/MachineSelect.react',
    'components/modals/instance_launch/IdentitySelect.react',
    'components/modals/instance_launch/InstanceSizeSelect.react',
    'components/modals/instance_launch/ProjectSelect.react',
    'components/common/Glyphicon.react'
  ],
  function (React, Backbone, stores, MachineSelect, IdentitySelect, InstanceSizeSelect, ProjectSelect, Glyphicon) {

    var ENTER_KEY = 13;

    function getState() {
      var state = {
        providers: stores.ProviderStore.getAll(),
        identities: stores.IdentityStore.getAll(),
        sizes: null,
        projects: stores.ProjectStore.getAll(),

        instanceName: null,
        machineId: null,
        identityId: null,
        sizeId: null,
        projectId: null,
        instances: null
      };

      if(state.projects){
        state.instances = stores.InstanceStore.getAll(state.projects);
      }

      this.state = this.state || {};
      if(this.state) {

        // Use provided instance name or default to nothing
        state.instanceName = this.state.instanceName || "";

        // Use selected identity or default to the first one
        if (state.identities) {
          state.identityId = this.state.identityId || state.identities.first().id;
        }

        // Use selected machine (image version) or default to the first one
        // todo: we should be sorting these by date or version number before selecting the first one
        var machines = this.props.image.get('machines');
        state.machineId = this.state.machineId || machines.first().id;

        // Fetch instance sizes user can launch if required information exists
        if(state.identities && state.providers && state.identityId){
          var selectedIdentity = state.identities.get(state.identityId);
          var selectedProvider = state.providers.get(selectedIdentity.get('provider').id);
          state.sizes = stores.SizeStore.getAllFor(selectedProvider.id, selectedIdentity.id);
        }

        // If we switch identities, while a size with the previous identity was selected, that size may
        // not exist in the new collection.  So check to see if it does, and set the sizeId to null if
        // doesn't exist (forcing the user to select a size in the new list)
        if(state.sizes){
          var selectedSize = state.sizes.get(this.state.sizeId);
          state.sizeId = selectedSize ? selectedSize.id : null;
        }

        // Use selected machine size or default to the first one
        if(state.sizes) {
          state.sizeId = state.sizeId || state.sizes.first().id;
        }
      }

      return state;
    }

    return React.createClass({

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      isSubmittable: function(){
        // Make sure the selected provider is not in maintenance
        var selectedIdentity = stores.IdentityStore.get(this.state.identityId);
        var isProviderInMaintenance = stores.MaintenanceMessageStore.isProviderInMaintenance(selectedIdentity.get('provider').id);
        var size;

        var hasInstanceName          = !!this.state.instanceName;
        var hasImageVersion          = !!this.state.machineId;
        var hasProvider              = !!this.state.identityId;
        var hasSize                  = !!this.state.sizeId;
        var hasAllocationAvailable   = this.hasAvailableAllocation(selectedIdentity);
        var providerNotInMaintenance = !isProviderInMaintenance;
        var hasEnoughQuotaForCpu = false;
        var hasEnoughQuotaForMemory = false;

        if(this.state.sizes){
          size = this.state.sizes.get(this.state.sizeId);
          hasEnoughQuotaForCpu = this.hasEnoughQuotaForCpu(selectedIdentity, size, this.state.sizes, this.state.instances);
          hasEnoughQuotaForMemory = this.hasEnoughQuotaForMemory(selectedIdentity, size, this.state.sizes, this.state.instances);
        }

        return hasInstanceName && hasImageVersion && hasProvider && hasSize && providerNotInMaintenance && hasAllocationAvailable && hasEnoughQuotaForCpu && hasEnoughQuotaForMemory;
      },

      //
      // Helper Functions
      //

      hasEnoughQuotaForCpu: function(identity, size, sizes, instances){
        var quota = identity.get('quota');
        var maximumAllowed = quota.cpu;
        var projected = size.get('cpu');
        var currentlyUsed = identity.getCpusUsed(instances, sizes);

        return (projected + currentlyUsed) <= maximumAllowed;
      },

      hasEnoughQuotaForMemory: function(identity, size, sizes, instances){
        var quota = identity.get('quota');
        var maximumAllowed = quota.mem;
        var projected = size.get('mem');
        var currentlyUsed = identity.getMemoryUsed(instances, sizes);

        return (projected + currentlyUsed) <= maximumAllowed;
      },

      hasAvailableAllocation: function(identity){
        var allocation = identity.get('allocation'),
            allocationConsumed = allocation.current,
            allocationTotal = allocation.threshold,
            allocationRemaining = allocationTotal - allocationConsumed;

        return allocationRemaining > 0;
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
        stores.SizeStore.addChangeListener(this.updateState);
        stores.ProjectStore.addChangeListener(this.updateState);
        stores.InstanceStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
        stores.InstanceStore.removeChangeListener(this.updateState);
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      onPrevious: function(){
        //this.props.onPrevious();
      },

      onNext: function () {
        var identity = this.state.identities.get(this.state.identityId);
        this.props.onNext(identity, this.state.machineId, this.state.sizeId, this.state.instanceName);
      },

      handleKeyDown: function(e){
        var text = e.target.value;
        if (e.which === ENTER_KEY) {
          e.preventDefault();
        }
      },

      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onInstanceNameChange: function(e){
        var newInstanceName = e.target.value;
        this.setState({instanceName: newInstanceName});
      },

      onMachineChange: function(e){
        var newMachineId = e.target.value;
        this.setState({machineId: newMachineId});
      },

      onProviderIdentityChange: function(e){
        var newIdentityId = e.target.value;
        this.setState({identityId: newIdentityId});
      },

      onSizeChange: function(e){
        var newSizeId = e.target.value;
        this.setState({sizeId: newSizeId});
      },

      //
      // Callbacks
      //

      onBack: function(){
        this.props.onPrevious(this.props.image);
      },

      onLaunch: function(){
        this.props.onNext(this.props.image);
      },

      //
      // Render
      // ------
      //

      renderAllocationWarning: function(identity){
        if(!this.hasAvailableAllocation(identity)) {
          return (
            <div className="alert alert-danger">
              <Glyphicon name='warning-sign'/>
              <strong>Uh oh!</strong>
              {
                "Looks like you don't have any AUs available.  In order to launch instances, you need " +
                "to have AU's free.  You will be able to launch again once your AU's have been reset."
              }
            </div>
          );
        }
      },

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

      renderCpuConsumption: function(identity, size, sizes, instances){
        var quota = identity.get('quota');
        var maximumAllowed = quota.cpu;
        var projected = size.get('cpu');
        var currentlyUsed = identity.getCpusUsed(instances, sizes);

        // convert to percentages
        var projectedPercent = projected / maximumAllowed * 100;
        var currentlyUsedPercent = currentlyUsed / maximumAllowed * 100;

        var message = "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted CPUs.";
        var overQuotaMessage = (
          <div>
            <strong>CPU quota exceeded.</strong>
            <span>{" Choose a smaller size or terminate a running instance."}</span>
          </div>
        );

        return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
      },

      renderMemoryConsumption: function(identity, size, sizes, instances){
        var quota = identity.get('quota');
        var maximumAllowed = quota.mem;
        var projected = size.get('mem');
        var currentlyUsed = identity.getMemoryUsed(instances, sizes);

        // convert to percentages
        var projectedPercent = projected / maximumAllowed * 100;
        var currentlyUsedPercent = currentlyUsed / maximumAllowed * 100;

        var message = "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted GBs of Memory.";
        var overQuotaMessage = (
          <div>
            <strong>Memory quota exceeded.</strong>
            <span>{" Choose a smaller size or terminate a running instance."}</span>
          </div>
        );

        return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
      },

      renderBody: function(){
        if(this.state.identities && this.state.providers && this.state.projects && this.state.sizes && this.state.instances){

          // Use selected machine (image version) or default to the first one
          // todo: we should be sorting these by date or version number before selecting the first one
          var machines = this.props.image.get('machines');
          var identity = this.state.identities.get(this.state.identityId);
          var size = this.state.sizes.get(this.state.sizeId);
          var instances = this.state.instances;
          var sizes = this.state.sizes;

          return (
            <div role='form'>

              {this.renderAllocationWarning(identity)}

              <div className="modal-section form-horizontal">
                <h4>Instance Details</h4>

                <div className='form-group'>
                  <label htmlFor='instance-name' className="col-sm-3 control-label">Instance Name</label>
                  <div className="col-sm-9">
                    <input type='text' className='form-control' id='instance-name' onChange={this.onInstanceNameChange} onKeyDown={this.handleKeyDown}/>
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='machine' className="col-sm-3 control-label">Version</label>
                  <div className="col-sm-9">
                    <MachineSelect machineId={this.state.machineId}
                                   machines={machines}
                                   onChange={this.onMachineChange}
                    />
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

                <div className='form-group'>
                  <label htmlFor='size' className="col-sm-3 control-label">Instance Size</label>
                  <div className="col-sm-9">
                    <InstanceSizeSelect
                        sizeId={this.state.sizeId}
                        sizes={this.state.sizes}
                        onChange={this.onSizeChange}
                    />
                  </div>
                </div>

              </div>

              <div className='form-group' className="modal-section">
                <h4>Projected Resource Usage</h4>
                {this.renderCpuConsumption(identity, size, sizes, instances)}
                {this.renderMemoryConsumption(identity, size, sizes, instances)}
              </div>

            </div>
          );
        }

        return (
          <div className="loading"></div>
        );
      },

      render: function () {
        return (
          <div>
            <div className="modal-body">
              {this.renderBody()}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default pull-left" onClick={this.onBack}>
                <span className="glyphicon glyphicon-chevron-left"></span>
                Back
              </button>
              <button type="button" className="btn btn-primary" onClick={this.onNext} disabled={!this.isSubmittable()}>
                Launch instance
              </button>
            </div>
          </div>
        );
      }

    });

  });
