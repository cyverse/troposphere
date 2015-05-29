define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
      stores = require('stores'),
      NameDescriptionStep = require('./request_image_wizard/NameDescriptionStep.react');

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
        tags: stores.TagStore.getAll(),
        step: 1
      };
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function () {
      stores.InstanceTagStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
      stores.InstanceTagStore.removeChangeListener(this.updateState);
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

    onPrevious: function(){
      var previousStep = this.state.step - 1;
      this.setState({step: previousStep});
    },

    onNext: function(image){
      var nextStep = this.state.step + 1;
      this.setState({step: nextStep});
    },

    //
    // Render
    // ------
    //

    renderBody: function(){
      var instance = this.props.instance,
          step = this.state.step;

      switch(step) {
        case 1:
          return (
            <NameDescriptionStep
              instance={instance}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
            />
          );
        case 2:
          return null;
      }
    },

    render: function () {

      return (
        <div className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                {this.renderCloseButton()}
                <strong>{"Image Request"}</strong>
              </div>
              {this.renderBody()}
            </div>
          </div>
        </div>
      );
    }

  });

});
