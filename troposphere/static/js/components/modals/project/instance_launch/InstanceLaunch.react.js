define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      _ = require('underscore'),
      stores = require('stores'),
      MachineSelect = require('components/modals/instance_launch/MachineSelect.react'),
      IdentitySelect = require('components/modals/instance_launch/IdentitySelect.react'),
      InstanceSizeSelect = require('components/modals/instance_launch/InstanceSizeSelect.react'),
      Glyphicon = require('components/common/Glyphicon.react');

  var ENTER_KEY = 13;

  return React.createClass({

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    isSubmittable: function(){
      var identities = stores.IdentityStore.getAll(),
          maintenanceMessages = stores.MaintenanceMessageStore.getAll(),
          sizes = stores.SizeStore.getAll(),
          instances = stores.InstanceStore.getAll(),
          identityId = this.state.identityId,
          sizeId = this.state.sizeId,
          selectedIdentity,
          isProviderInMaintenance,
          size;

      if(!identities || !maintenanceMessages || !sizes || !instances || !identityId || !sizeId) return false;

      // Make sure the selected provider is not in maintenance
      selectedIdentity = identities.get(identityId);
      isProviderInMaintenance = stores.MaintenanceMessageStore.isProviderInMaintenance(selectedIdentity.get('provider').id);
      size = sizes.get(sizeId);

      var hasInstanceName          = !!this.state.instanceName,
          hasImageVersion          = !!this.state.machineId,
          hasProvider              = !!this.state.identityId,
          hasSize                  = !!this.state.sizeId,
          hasAllocationAvailable   = this.hasAvailableAllocation(selectedIdentity),
          providerNotInMaintenance = !isProviderInMaintenance,
          hasEnoughQuotaForCpu     = this.hasEnoughQuotaForCpu(selectedIdentity, size, sizes, instances),
          hasEnoughQuotaForMemory  = this.hasEnoughQuotaForMemory(selectedIdentity, size, sizes, instances);

      return (
        hasInstanceName &&
        hasImageVersion &&
        hasProvider &&
        hasSize &&
        providerNotInMaintenance &&
        hasAllocationAvailable &&
        hasEnoughQuotaForCpu &&
        hasEnoughQuotaForMemory
      );
    },

    //
    // Helper Functions
    //

    hasEnoughQuotaForCpu: function(identity, size, sizes, instances){
      var quota = identity.get('quota'),
          maximumAllowed = quota.cpu,
          projected = size.get('cpu'),
          currentlyUsed = identity.getCpusUsed(instances, sizes);

      return (projected + currentlyUsed) <= maximumAllowed;
    },

    hasEnoughQuotaForMemory: function(identity, size, sizes, instances){
      var quota = identity.get('quota'),
          maximumAllowed = quota.memory,
          projected = size.get('mem'),
          currentlyUsed = identity.getMemoryUsed(instances, sizes);

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

    getState: function(){
      var image = this.props.application,
          machines = image.get('provider_images'),
          identities = stores.IdentityStore.getAll(),
          //maintenanceMessages = stores.MaintenanceMessageStore.getAll(),
          //sizes = stores.SizeStore.getAll(),
          //instances = stores.InstanceStore.getAll(),
          providers = stores.ProviderStore.getAll(),
          providerSizes,
          selectedIdentity,
          selectedProvider,
          selectedSize;

      var state = this.state || {
        instanceName: null,
        machineId: null,
        identityId: null,
        sizeId: null
      };

      // Use provided instance name or default to nothing
      state.instanceName = state.instanceName || "";

      // Use selected identity or default to the first one
      if (identities) {

        // remove identities whose provider has no image
        identities = new identities.constructor(identities.filter(function(i){
          return machines.find(function(m){
            return m.get('provider').id === i.get('provider').id;
          });
        }));

        state.identityId = state.identityId || identities.first().id;
      }

      // Use selected machine (image version) or default to the first one
      // todo: we should be sorting these by date or version number before selecting the first one
      if(machines) {

        // don't show duplicate images
        machines = new machines.constructor(_.uniq(machines.models, function(m){
          return m.get('uuid');
        }));

        state.machineId = state.machineId || machines.first().id;
      }

      // Fetch instance sizes user can launch if required information exists
      if(identities && providers && state.identityId){
        selectedIdentity = identities.get(state.identityId);
        selectedProvider = providers.get(selectedIdentity.get('provider').id);
        providerSizes = stores.SizeStore.fetchWhere({
          provider__id: selectedProvider.id,
          page_size: 100
        });
      }

      // If we switch identities, while a size with the previous identity was selected, that size may
      // not exist in the new collection.  So check to see if it does, and set the sizeId to null if
      // doesn't exist (forcing the user to select a size in the new list)
      if(providerSizes){
        selectedSize = providerSizes.get(state.sizeId);
        state.sizeId = selectedSize ? selectedSize.id : null;
      }

      // Use selected machine size or default to the first one
      if(providerSizes) {
        state.sizeId = state.sizeId || providerSizes.first().id;
      }

      return state;
    },

    getInitialState: function(){
      return this.getState();
      return {
        instanceName: null,
        machineId: null,
        identityId: null,
        sizeId: null
      };
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function () {
      stores.ProviderStore.addChangeListener(this.updateState);
      stores.IdentityStore.addChangeListener(this.updateState);
      stores.SizeStore.addChangeListener(this.updateState);
      stores.InstanceStore.addChangeListener(this.updateState);
      stores.MaintenanceMessageStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ProviderStore.removeChangeListener(this.updateState);
      stores.IdentityStore.removeChangeListener(this.updateState);
      stores.SizeStore.removeChangeListener(this.updateState);
      stores.InstanceStore.removeChangeListener(this.updateState);
      stores.MaintenanceMessageStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    onPrevious: function(){
      //this.props.onPrevious();
    },

    onNext: function () {
      var identity = stores.IdentityStore.get(this.state.identityId);

      this.props.onNext(
        identity,
        this.state.machineId,
        this.state.sizeId,
        this.state.instanceName
      );
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
      var newIdentityId = e.target.value,
          identity = stores.IdentityStore.get(newIdentityId),
          providerId = identity.get('provider').id,
          provider = stores.ProviderStore.get(providerId),
          sizes = stores.SizeStore.fetchWhere({
            provider__id: provider.id,
            page_size: 100
          });

      this.setState({
        identityId: newIdentityId,
        sizeId: sizes ? sizes.first().id : null
      });
    },

    onSizeChange: function(e){
      var newSizeId = e.target.value;
      this.setState({sizeId: newSizeId});
    },

    //
    // Callbacks
    //

    onBack: function(){
      this.props.onPrevious(this.props.application);
    },

    onLaunch: function(){
      this.props.onNext(this.props.application);
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
      var currentlyUsedStyle = { width: currentlyUsedPercent + "%" },
          projectedUsedStyle = { width: projectedPercent + "%", opacity: "0.6" },
          totalPercent = currentlyUsedPercent + projectedPercent,
          barTypeClass;

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
      var quota = identity.get('quota'),
          maximumAllowed = quota.cpu,
          projected = size.get('cpu'),
          currentlyUsed = identity.getCpusUsed(instances, sizes),
          // convert to percentages
          projectedPercent = projected / maximumAllowed * 100,
          currentlyUsedPercent = currentlyUsed / maximumAllowed * 100,
          message = (
            "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted CPUs."
          ),
          overQuotaMessage = (
            <div>
              <strong>CPU quota exceeded.</strong>
              <span>{" Choose a smaller size or terminate a running instance."}</span>
            </div>
          );

      return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
    },

    renderMemoryConsumption: function(identity, size, sizes, instances){
      var quota = identity.get('quota'),
          maximumAllowed = quota.memory,
          projected = size.get('mem'),
          currentlyUsed = identity.getMemoryUsed(instances, sizes),
          // convert to percentages
          projectedPercent = projected / maximumAllowed * 100,
          currentlyUsedPercent = currentlyUsed / maximumAllowed * 100,
          message = (
            "You will use " + (Math.round(currentlyUsed + projected)) + " of " + maximumAllowed + " allotted GBs of Memory."
          ),
          overQuotaMessage = (
            <div>
              <strong>Memory quota exceeded.</strong>
              <span>{" Choose a smaller size or terminate a running instance."}</span>
            </div>
          );

      return this.renderProgressBar(message, currentlyUsedPercent, projectedPercent, overQuotaMessage);
    },

    renderBody: function(){
      var image = this.props.application,
          identities = stores.IdentityStore.getAll(),
          providers = stores.ProviderStore.getAll(),
          sizes = stores.SizeStore.getAll(),
          instances = stores.InstanceStore.getAll(),
          selectedIdentity,
          selectedProvider,
          providerSizes;

      if(!identities || !providers || !sizes || !instances) return <div className="loading"></div>;

      if(this.state.identityId){
        selectedIdentity = identities.get(this.state.identityId);
        selectedProvider = providers.get(selectedIdentity.get('provider').id);
        providerSizes = stores.SizeStore.fetchWhere({
          provider__id: selectedProvider.id,
          page_size: 100
        });
      }

      if(!providerSizes) return <div className="loading"></div>;

      // Use selected machine (image version) or default to the first one
      // todo: we should be sorting these by date or version number before selecting the first one
      var machines = image.get('provider_images'),
          identity = identities.get(this.state.identityId),
          size = providerSizes.get(this.state.sizeId);

      // remove identities whose provider has no image
      identities = new identities.constructor(identities.filter(function(i){
        return machines.find(function(m){
          return m.get('provider').id === i.get('provider').id;
        });
      }));

      // don't show duplicate images
      machines = new machines.constructor(_.uniq(machines.models, function(m){
        return m.get('uuid');
      }));

      return (
        <div role='form'>

          {this.renderAllocationWarning(identity)}

          <div className="modal-section form-horizontal">
            <h4>Instance Details</h4>

            <div className='form-group'>
              <label htmlFor='instance-name' className="col-sm-3 control-label">Instance Name</label>
              <div className="col-sm-9">
                <input
                  type='text'
                  className='form-control'
                  id='instance-name'
                  onChange={this.onInstanceNameChange}
                  onKeyDown={this.handleKeyDown}
                />
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='machine' className="col-sm-3 control-label">Version</label>
              <div className="col-sm-9">
                <MachineSelect
                  machineId={this.state.machineId}
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
                    identities={identities}
                    providers={providers}
                    onChange={this.onProviderIdentityChange}
                />
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='size' className="col-sm-3 control-label">Instance Size</label>
              <div className="col-sm-9">
                <InstanceSizeSelect
                    sizeId={this.state.sizeId}
                    sizes={providerSizes}
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
