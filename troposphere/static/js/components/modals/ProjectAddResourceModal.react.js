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
        identities: IdentityStore.getAll()
      };

      this.state = this.state || {};

      state.selectedResourceType = this.state.selectedResourceType || resourceTypes[1];
      state.contentIsValid = this.state.contentIsValid || false;

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

      onCreateResource: function(){
        this.hide();
        var resourceName = this.state.selectedResourceType.name;

        var resourceParams;
        if(resourceName === "Volume"){
          resourceParams = this.refs.resource.getVolumeParams();
          resourceParams.identity = this.state.identities.get(resourceParams.identityId)
          delete resourceParams['identityId'];
          this.props.onCreateVolume(resourceParams);
        }
      },


      //
      // Custom Modal Callbacks
      // ----------------------
      //

      onResourceTypeChanged: function(newResourceType){
        this.setState({selectedResourceType: newResourceType});
      },

      //
      // Render
      // ------
      //

      getButtons: function(confirmButtonMessage, canCreateResource){
        var buttonArray = [
          {type: 'danger', text: 'Cancel', handler: this.cancel},
          {type: 'primary', text: confirmButtonMessage, handler: this.onCreateResource}
        ];

        var buttons = buttonArray.map(function (button) {
          // Enable all buttons be default
          var isDisabled = false;

          // Disable the launch button if user hasn't specified all the required data to create the resource
          if(button.type === "primary") isDisabled = !canCreateResource;

          return (
            <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler} disabled={isDisabled}>
              {button.text}
            </button>
          );
        }.bind(this));

        return buttons;
      },

      onContentChanged: function(isValid, resourceProps){
        // if isValid, button should be shown
        // contentState is passed back to component
        //
        console.log(resourceProps);
        this.setState({contentIsValid: isValid});
      },

      render: function () {

        //
        // Body Content
        //

        var content = (
          <div className="loading"></div>
        );
        var confirmButtonText = "Add Resource";
        var selectedResourceName = this.state.selectedResourceType.name;
        if(selectedResourceName === "Volume"){
          confirmButtonText = "Create Volume";
          if(this.state.identities && this.state.providers) {
            content = (
              <VolumeResourceContent ref="resource"
                                     providers={this.state.providers}
                                     identities={this.state.identities}
                                     onChange={this.onContentChanged}
              />
            );
          }
        } else if(selectedResourceName === "Instance"){
          content = (
           <InstanceResourceContent ref="resource"/>
         );
        }

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
                  {this.getButtons(confirmButtonText, this.state.contentIsValid)}
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
