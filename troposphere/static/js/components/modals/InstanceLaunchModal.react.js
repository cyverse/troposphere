/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'stores/ProviderStore',
    'stores/IdentityStore',
    'stores/SizeStore',
    'stores/InstanceStore',
    'stores/ProjectStore',
    './instance_launch/MachineSelect.react',
    './instance_launch/IdentitySelect.react',
    './instance_launch/InstanceSizeSelect.react',
    './instance_launch/ProjectSelect.react'
  ],
  function (React, BootstrapModalMixin, ProviderStore, IdentityStore, SizeStore, InstanceStore, ProjectStore, MachineSelect, IdentitySelect, InstanceSizeSelect, ProjectSelect) {

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
      var state = {
        providers: ProviderStore.getAll(),
        identities: IdentityStore.getAll(),
        // todo: The only reason InstanceStore is here is because if the instance is launched, the store
        // will 1) try to add it to the existing instances collection (which may not have been fetched
        // at this point) and 2) will redirect to the /instances page, and if the instances haven't been
        // fetched then this instance can't be added to the list and the user won't see it.  To resolve
        // both of these use cases, I'm requiring the instances to be fetched at this point...a better
        // approach might be to load the instances in the InstanceStore at the point we try to add this
        // new instance to a non-existent list, and register a callback to add this instance once all of
        // the instances are loaded (but we'd need to handle the edge case where the instance fails to load
        // and we're notified before the full instance collection returns)
        instances: InstanceStore.getAll(),
        sizes: null,
        projects: ProjectStore.getAll(),

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
          state.sizes = SizeStore.getAllFor(selectedProvider.id, selectedIdentity.id);
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
        ProviderStore.addChangeListener(this.updateState);
        IdentityStore.addChangeListener(this.updateState);
        SizeStore.addChangeListener(this.updateState);
        InstanceStore.addChangeListener(this.updateState);
        ProjectStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
        InstanceStore.removeChangeListener(this.updateState);
        ProjectStore.removeChangeListener(this.updateState);
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
      render: function () {
        var buttonArray = [
          {type: 'danger', text: 'Cancel', handler: this.cancel},
          {type: 'primary', text: this.props.confirmButtonMessage, handler: this.confirm}
        ];
        var buttons = buttonArray.map(function (button) {
          // Enable all buttons be default
          var isDisabled = false;

          // Disable the launch button if the user hasn't provided a name for the instance
          var stateIsValid = this.state.instanceName &&
                             this.state.machineId &&
                             this.state.identityId &&
                             this.state.sizeId;
          if(button.type === "primary" && !stateIsValid ) isDisabled = true;

          return (
            <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler} disabled={isDisabled}>
              {button.text}
            </button>
          );
        }.bind(this));

        var content;
        if(this.state.identities && this.state.providers && this.state.instances && this.state.projects && this.state.sizes){

          // Use selected machine (image version) or default to the first one
          // todo: we should be sorting these by date or version number before selecting the first one
          var machines = this.props.application.get('machines');

          content = (
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
                <label htmlFor='identity'>Identity</label>
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
        }else{
          content = (
            <div className="loading"></div>
          );
        }

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
