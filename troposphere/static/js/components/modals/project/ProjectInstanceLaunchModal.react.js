/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react',
    'stores',
    './instance_launch/ImageListView.react',
    './instance_launch/ImageDetailsView.react',
    './instance_launch/ImageLaunchView.react'
  ],
  function (React, Backbone, BootstrapModalMixin, stores, ImageListView, ImageDetailsView, ImageLaunchView) {

    return React.createClass({
      mixins: [BootstrapModalMixin],

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function(){
        return this.getState();
      },

      getState: function() {
        return {
          providers: stores.ProviderStore.getAll(),
          identities: stores.IdentityStore.getAll(),
          tags: stores.TagStore.getAll()
        };
      },

      updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
      },

      componentDidMount: function () {
        stores.ApplicationStore.addChangeListener(this.updateState);
        stores.ProviderStore.addChangeListener(this.updateState);
        stores.IdentityStore.addChangeListener(this.updateState);
        stores.TagStore.addChangeListener(this.updateState);

        // todo: MachineStore is only included here because
        // MachineStore.get(providerId, identityId, machineId) called by versions/MachineList
        // is lazy loaded, so I need to re-trigger the render cycle when the machine data
        // returns from the server.
        stores.MachineStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function() {
        stores.ApplicationStore.removeChangeListener(this.updateState);
        stores.ProviderStore.removeChangeListener(this.updateState);
        stores.IdentityStore.removeChangeListener(this.updateState);
        stores.TagStore.removeChangeListener(this.updateState);
        stores.MachineStore.removeChangeListener(this.updateState);
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function(){
        this.hide();
      },

      handleLaunchImage: function(identity, machineId, sizeId, instanceName){
        this.hide();
        this.props.onConfirm(this.state.image, identity, machineId, sizeId, instanceName);
      },

      //
      // Navigation Callbacks
      //

      navigateToListView: function(){
        this.setState({image: null, configureImage: false});
      },

      navigateToDetailsView: function(image){
        this.setState({image: image, configureImage: false});
      },

      navigateToLaunchView: function(image){
        this.setState({image: image, configureImage: true});
      },

      //
      // Render
      // ------
      //

      renderTitle: function(){
        var image = this.state.image,
            configureImage = this.state.configureImage,
            title = "";

        if(image && configureImage){
          title = "Configure Image";
        }else if(image && !configureImage){
          title = "Review Image";
        }else{
          title = "Select Image";
        }

        return title;
      },

      renderBody: function(){
        var image = this.state.image,
            configureImage = this.state.configureImage,
            providers = this.state.providers,
            identities = this.state.identities,
            tags = this.state.tags;

        if(image && configureImage){
          return (
            <ImageLaunchView image={image}
                             providers={providers}
                             identities={identities}
                             tags={tags}
                             onPrevious={this.navigateToDetailsView}
                             onNext={this.handleLaunchImage}
            />
          )
        }else if(image && !configureImage){
          return (
            <ImageDetailsView image={image}
                              providers={providers}
                              identities={identities}
                              tags={tags}
                              onPrevious={this.navigateToListView}
                              onNext={this.navigateToLaunchView}
            />
          )
        }else{
          return (
            <ImageListView onPrevious={this.cancel}
                           onNext={this.navigateToDetailsView}
            />
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
                  <strong>{this.renderTitle()}</strong>
                </div>
                {this.renderBody()}
              </div>
            </div>
          </div>
        );
      }

    });

  });
