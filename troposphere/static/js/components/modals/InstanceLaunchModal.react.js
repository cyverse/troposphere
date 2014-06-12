/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'stores/ProviderStore',
    'stores/IdentityStore',
    'stores/SizeStore',
    'stores/InstanceStore',
    './instance_launch/MachineSelect.react',
    './instance_launch/IdentitySelect.react',
    './instance_launch/InstanceSizeSelect.react'
  ],
  function (React, BootstrapModalMixin, ProviderStore, IdentityStore, SizeStore, InstanceStore, MachineSelect, IdentitySelect, InstanceSizeSelect) {

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
        instances: InstanceStore.getAll()
      };
    }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      //
      // Mounting & State
      // ----------------
      //
      getInitialState: function(){
        var initialState = getState();
        initialState.instanceName = null;
        initialState.machineId = null;
        initialState.identityId = null;
        initialState.sizeId = null;
        return initialState;
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
      },

      componentDidMount: function () {
        ProviderStore.addChangeListener(this.updateState);
        IdentityStore.addChangeListener(this.updateState);
        SizeStore.addChangeListener(this.updateState);
        InstanceStore.addChangeListener(this.updateState);
      },

      componentDidUnmount: function () {
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
        SizeStore.removeChangeListener(this.updateState);
        InstanceStore.removeChangeListener(this.updateState);
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      // remove the modal from the DOM once we're finished with it
      handleHidden: function(){
        document.getElementById('modal').innerHTML = "";
      },

      cancel: function(){
        this.hide();
      },

      confirm: function () {
        this.hide();
        var identity = this.state.identities.get(this.state.identityId);
        this.props.onConfirm(identity, this.state.machineId, this.state.sizeId, this.state.instanceName);
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
        if(this.state.identities && this.state.providers && this.state.instances){

          // Use selected identity or default to the first one
          this.state.identityId = this.state.identityId || this.state.identities.first().id;

          // Use selected machine (image version) or default to the first one
          // todo: we should be sorting these by date or version number before selecting the first one
          var machines = this.props.application.get('machines');
          this.state.machineId = this.state.machineId || machines.first().id;

          // The provider & identity combination the user has selected (or defaulted to)
          var selectedIdentity = this.state.identities.get(this.state.identityId);
          var selectedProvider = this.state.providers.get(selectedIdentity.get('provider_id'));

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
                    provider={selectedProvider}
                    identity={selectedIdentity}
                    onChange={this.onSizeChange}
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
