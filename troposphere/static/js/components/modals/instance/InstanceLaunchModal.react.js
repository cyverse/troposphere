/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'stores',
    '../instance_launch/MachineSelect.react',
    '../instance_launch/IdentitySelect.react',
    '../instance_launch/InstanceSizeSelect.react',
    '../instance_launch/ProjectSelect.react',
    'components/common/Glyphicon.react'
  ],
  function (React, Backbone, BootstrapModalMixin, stores, MachineSelect, IdentitySelect, InstanceSizeSelect, ProjectSelect, Glyphicon) {

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
        var machines = this.props.application.get('machines');
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

        // Use selected project or default to the null one
        if(state.projects) {
          state.projectId = state.projectId || state.projects.length > 0 ? state.projects.first() : null;
        }

        // Use provided instance name or default to nothing
        state.projectName = this.state.projectName || "";
      }

      return state;
    }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
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
        var hasProject               = !!this.state.projectId || !!this.state.projectName;
        var hasAllocationAvailable   = this.hasAvailableAllocation(selectedIdentity);
        var providerNotInMaintenance = !isProviderInMaintenance;
        var hasEnoughQuotaForCpu = false;
        var hasEnoughQuotaForMemory = false;

        if(this.state.sizes){
          size = this.state.sizes.get(this.state.sizeId);
          hasEnoughQuotaForCpu = this.hasEnoughQuotaForCpu(selectedIdentity, size, this.state.sizes, this.state.instances);
          hasEnoughQuotaForMemory = this.hasEnoughQuotaForMemory(selectedIdentity, size, this.state.sizes, this.state.instances);
        }

        return hasInstanceName && hasImageVersion && hasProvider && hasSize && providerNotInMaintenance && hasAllocationAvailable && hasEnoughQuotaForCpu && hasEnoughQuotaForMemory && hasProject;
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

      // remove the modal from the DOM once we're finished with it
      //handleHidden: function(){
      //  document.getElementById('modal').innerHTML = "";
      //},

      cancel: function(){
        this.hide();
        //this.props.onCancel();
      },

      confirm: function () {
        this.hide();
        var identity = this.state.identities.get(this.state.identityId);
        var project = this.state.projects.get(this.state.projectId);
        if(this.state.projectName){
          this.props.onConfirm(identity, this.state.machineId, this.state.sizeId, this.state.instanceName, this.state.projectName);
        }else{
          this.props.onConfirm(identity, this.state.machineId, this.state.sizeId, this.state.instanceName, project);
        }
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

      onProjectChange: function(e){
        var newProjectId = e.target.value;
        this.setState({projectId: newProjectId});
      },

      onProjectNameChange: function (e) {
        this.setState({projectName: e.target.value});
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
              <strong>{"Uh oh!"}</strong>
              {
                " Looks like you don't have any AUs available.  In order to launch instances, you need " +
                "to have AUs free.  You will be able to launch again once your AUs have been reset."
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

      renderProjectSelectionForm: function(){
        if (this.state.projects.length > 0) {
          return (
            <ProjectSelect projectId={this.state.projectId}
                           projects={this.state.projects}
                           onChange={this.onProjectChange}
            />
          );
        }
      },

      renderProjectCreationForm: function(){
        if(this.state.projects.length <= 0){
          return (
            <input type="text"
                   className="form-control"
                   value={this.state.projectName}
                   onChange={this.onProjectNameChange}
                   placeholder="Enter project name..."
            />
          )
        }
      },

      renderBody: function(){
        if(this.state.identities && this.state.providers && this.state.projects && this.state.sizes && this.state.instances){

          // Use selected machine (image version) or default to the first one
          // todo: we should be sorting these by date or version number before selecting the first one
          var machines = this.props.application.get('machines');
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

                <div className='form-group'>
                  <label htmlFor='project' className="col-sm-3 control-label">Project</label>
                  <div className="col-sm-9">
                    {this.renderProjectSelectionForm()}
                    {this.renderProjectCreationForm()}
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
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Launch instance of {this.props.application.get('name')}</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                    Launch instance
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
