define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      _ = require('underscore'),
      BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
      stores = require('stores'),
      NameDescriptionTagsStep = require('./request_image_wizard/NameDescriptionTagsStep.react'),
      ProviderStep = require('./request_image_wizard/ProviderStep.react'),
      VisibilityStep = require('./request_image_wizard/VisibilityStep.react'),
      FilesToExcludeStep = require('./request_image_wizard/FilesToExcludeStep.react'),
      ReviewStep = require('./request_image_wizard/ReviewStep.react');

  return React.createClass({
    mixins: [BootstrapModalMixin],

    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function(){
      return {
        step: 1,
        name: "",
        description: "",
        imageTags: null,
        providerId: null,
        visibility: "public",
        imageUsers: null,
        filesToExclude: ""
      };
    },

    getState: function() {
      return this.state;
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function () {
      stores.InstanceTagStore.addChangeListener(this.updateState);
      stores.UserStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
      stores.InstanceTagStore.removeChangeListener(this.updateState);
      stores.UserStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function(){
      this.hide();
    },

    onRequestImage: function(){
      var params = {
        name: this.state.name,
        description: this.state.description,
        tags: this.state.imageTags,
        providerId: this.state.providerId,
        visibility: this.state.visibility,
        imageUsers: this.state.imageUsers,
        filesToExclude: this.state.filesToExclude.trim()
      };
      this.hide();
      this.props.onConfirm(params);
    },

    //
    // Navigation Callbacks
    //

    onPrevious: function(data){
      var previousStep = this.state.step - 1,
          data = data || {},
          state = _.extend({step: previousStep}, data);
      this.setState(state);
    },

    onNext: function(data){
      var nextStep = this.state.step + 1,
          data = data || {},
          state = _.extend({step: nextStep}, data);
      this.setState(state);
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
            <NameDescriptionTagsStep
              name={this.state.name}
              description={this.state.description}
              imageTags={this.state.imageTags}
              instance={instance}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
            />
          );

        case 2:
          return (
            <ProviderStep
              instance={instance}
              providerId={this.state.providerId}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
            />
          );

        case 3:
          return (
            <VisibilityStep
              instance={instance}
              visibility={this.state.visibility}
              imageUsers={this.state.imageUsers}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
            />
          );

        case 4:
          return (
            <FilesToExcludeStep
              filesToExclude={this.state.filesToExclude}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
            />
          );

        case 5:
          return (
            <ReviewStep
              imageData={this.state}
              onPrevious={this.onPrevious}
              onNext={this.onRequestImage}
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
