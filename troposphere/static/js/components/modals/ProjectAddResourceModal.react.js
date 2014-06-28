/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'stores/ProviderStore',
    'stores/IdentityStore',
    './instance_launch/IdentitySelect.react',
    './project_resource/ResourceTypeMenu.react',
    './project_resource/VolumeResourceContent.react',
    './project_resource/InstanceResourceContent.react'
  ],
  function (React, BootstrapModalMixin, ProviderStore, IdentityStore, IdentitySelect, ResourceTypeMenu, VolumeResourceContent, InstanceResourceContent) {

    var resourceTypes = [
      {
        name: "Instance",
        glyph: "tasks"
      },
      {
        name: "Volume",
        glyph: "hdd"
      }
    ];

    function getState() {
      var state = {
        providers: ProviderStore.getAll(),
        identities: IdentityStore.getAll(),

        volumeName: null,
        identityId: null
      };

      this.state = this.state || {};

      state.selectedResourceType = this.state.selectedResourceType || resourceTypes[1];

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
        ProviderStore.addChangeListener(this.updateState);
        IdentityStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        ProviderStore.removeChangeListener(this.updateState);
        IdentityStore.removeChangeListener(this.updateState);
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

      onResourceTypeChanged: function(newResourceType){
        this.setState({selectedResourceType: newResourceType});
      },

      //
      // Render
      // ------
      //

      getButtons: function(confirmButtonMessage, isEnabled, bodyState){
        var buttonArray = [
          {type: 'danger', text: 'Cancel', handler: this.cancel},
          {type: 'primary', text: confirmButtonMessage, handler: this.confirm}
        ];

        var buttons = buttonArray.map(function (button) {
          // Enable all buttons be default
          var isDisabled = false;

          // Disable the launch button if the user hasn't provided a name, size or identity for the volume
          var stateIsValid = this.state.identityId &&
                             this.state.volumeName &&
                             this.state.volumeSize;
          if(button.type === "primary" && !stateIsValid ) isDisabled = true;

          return (
            <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler} disabled={isDisabled}>
              {button.text}
            </button>
          );
        }.bind(this));
      },

      onContentChanged: function(contentState, isValid){
        // if isValid, button should be shown
        // contentState is passed back to component
        //
      },

      onCreateResource: function(){
        var resourceName = this.state.selectedResourceType.name;

        var resourceParams;
        if(resourceName === "Volume"){
          resourceParams = this.refs.content.getVolumeParams();
          this.props.onCreateVolume(resourceParams);
        }
      },

      render: function () {

        //
        // Body Content
        //

        var content;
        var selectedResourceName = this.state.selectedResourceType.name;
        if(selectedResourceName === "Volume"){
          content = (
            <VolumeResourceContent ref="resource"/>
          );
        } else if(selectedResourceName === "Instance"){
          content = (
           <InstanceResourceContent ref="resource"/>
         );
        } else {
         content = (
           <div className="loading"></div>
         );
        }

        //
        // Button Content
        //

        var buttonArray = [
          {type: 'danger', text: 'Cancel', handler: this.cancel},
          {type: 'primary', text: this.props.confirmButtonMessage, handler: this.confirm}
        ];

        var buttons = buttonArray.map(function (button) {
          // Enable all buttons be default
          var isDisabled = false;

          // Disable the launch button if the user hasn't provided a name, size or identity for the volume
          var stateIsValid = this.state.identityId &&
                             this.state.volumeName &&
                             this.state.volumeSize;
          if(button.type === "primary" && !stateIsValid ) isDisabled = true;

          return (
            <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler} disabled={isDisabled}>
              {button.text}
            </button>
          );
        }.bind(this));

        //
        // Modal Content
        //

        return (
          <div id="project-resource-modal" className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>{this.props.header}</strong>
                </div>
                <div className="modal-body">
                  <ResourceTypeMenu resourceTypes={resourceTypes}
                                    selectedResourceType={this.state.selectedResourceType}
                                    onResourceTypeChanged={this.onResourceTypeChanged}
                  />
                  <hr/>
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
