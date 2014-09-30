/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'stores',
    '../instance_launch/MachineSelect.react',
    '../instance_launch/IdentitySelect.react',
    '../instance_launch/InstanceSizeSelect.react',
    '../instance_launch/ProjectSelect.react'
  ],
  function (React, BootstrapModalMixin, stores, MachineSelect, IdentitySelect, InstanceSizeSelect, ProjectSelect) {

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
        projectId: null
      };

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
          var selectedProvider = state.providers.get(selectedIdentity.get('provider_id'));
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
          state.projectId = state.projectId || state.projects.first().id;
        }
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
        var isProviderInMaintenance = stores.MaintenanceMessageStore.isProviderInMaintenance(selectedIdentity.get('provider_id'));

        var hasInstanceName          = !!this.state.instanceName;
        var hasImageVersion          = !!this.state.machineId;
        var hasProvider              = !!this.state.identityId;
        var hasSize                  = !!this.state.sizeId;
        var providerNotInMaintenance = !isProviderInMaintenance;

        return hasInstanceName && hasImageVersion && hasProvider && hasSize && providerNotInMaintenance;
      },

      //
      // Mounting & State
      // ----------------
      //
      getInitialState: function(){
        var initialState = getState.apply(this);
        return initialState;
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState.apply(this));
      },

      componentDidMount: function () {
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.SizeStore.addChangeListener(this.updateState);
        stores.ProjectStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.SizeStore.removeChangeListener(this.updateState);
        stores.ProjectStore.removeChangeListener(this.updateState);
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
        this.props.onConfirm(identity, this.state.machineId, this.state.sizeId, this.state.instanceName, project);
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

      //
      // Render
      // ------
      //

      renderBody: function(){
        if(this.state.identities && this.state.providers && this.state.projects && this.state.sizes){

          // Use selected machine (image version) or default to the first one
          // todo: we should be sorting these by date or version number before selecting the first one
          var machines = this.props.application.get('machines');

          return (
            <form role='form'>

              <div className='form-group'>
                <label htmlFor='instance-name'>Instance Name</label>
                <input type='text' className='form-control' id='instance-name' onChange={this.onInstanceNameChange}/>
              </div>

              <div className='form-group'>
                <label htmlFor='machine'>Version</label>
                <MachineSelect machineId={this.state.machineId}
                               machines={machines}
                               onChange={this.onMachineChange}
                />
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

              <div className='form-group'>
                <label htmlFor='size'>Instance Size</label>
                <InstanceSizeSelect
                    sizeId={this.state.sizeId}
                    sizes={this.state.sizes}
                    onChange={this.onSizeChange}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='project'>Project</label>
                <ProjectSelect
                    projectId={this.state.projectId}
                    projects={this.state.projects}
                    onChange={this.onProjectChange}
                />
              </div>
            </form>
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
