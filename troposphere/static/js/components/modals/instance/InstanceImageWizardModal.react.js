define(function (require) {

  var React = require('react'),
      _ = require('underscore'),
      BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
      stores = require('stores'),
      ImageInfoStep = require('./image/steps/ImageInfoStep.react'),
      VersionInfoStep = require('./image/steps/VersionInfoStep.react'),
      ProviderStep = require('./image/steps/ProviderStep.react'),
      VisibilityStep = require('./image/steps/VisibilityStep.react'),
      FilesToExcludeStep = require('./image/steps/FilesToExcludeStep.react'),
      BootScriptsStep = require('./image/steps/BootScriptsStep.react'),
      LicensingStep = require('./image/steps/LicensingStep.react'),
      ReviewStep = require('./image/steps/ReviewStep.react');

  return React.createClass({
    displayName: "InstanceImageWizardModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onConfirm: React.PropTypes.func.isRequired,
      imageOwner: React.PropTypes.bool.isRequired
    },
    //
    // Mounting & State
    // ----------------
    //

    getInitialState: function(){
      return {
        step: 1,
        name: this.props.instance.get('image').name,
        description: this.props.instance.get('image').description,
        versionName: this.props.versionName || "1.0",
        versionChanges: "",
        imageTags: null,
        providerId: null,
        visibility: "public",
        imageUsers: null,
        activeScripts: new Backbone.Collection(),
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
      var scriptIDs, licenseIDs;
      scriptIDs = this.state.activeScripts.map(function(script) {
        return script.id;
      }),
      licenseIDs = this.state.activeLicenses.map(function(license) {
        return license.id;
      });
      var params = {
        newImage: this.state.newImage,
        name: this.state.name,
        description: this.state.description,
        tags: this.state.imageTags,
        providerId: this.state.providerId,
        visibility: this.state.visibility,
        imageUsers: this.state.imageUsers,
        filesToExclude: this.state.filesToExclude.trim(),
        scripts: scriptIDs,
        licenses: licenseIDs
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
          step = this.state.step,
          allLicenses = stores.LicenseStore.getAll(),
          activeLicenses = this.state.activeLicenses,
          allScripts = stores.ScriptStore.getAll(),
          activeScripts = this.state.activeScripts;

      switch(step) {
        case 1:
          return (
            <ImageInfoStep
              name={this.state.name}
              description={this.state.description}
              imageTags={this.state.imageTags}
              instance={instance}
              imageOwner={this.props.imageOwner}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              />
          );

        case 2:
          return (
            <VersionInfoStep
              versionName={this.state.versionName}
              versionChanges={this.state.versionChanges}
              instance={instance}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              />
          );

        case 3:
          return (
            <ProviderStep
              instance={instance}
              providerId={this.state.providerId}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
            />
          );

        case 4:
          return (
            <VisibilityStep
              instance={instance}
              visibility={this.state.visibility}
              imageUsers={this.state.imageUsers}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
            />
          );

        case 5:
          return (
            <FilesToExcludeStep
              filesToExclude={this.state.filesToExclude}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              />
          );

        case 6:
          return (
            <BootScriptsStep
              instance={instance}
              activeScripts={activeScripts}
              scripts={allScripts}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              />
          );

        case 7:
          return (
            <LicensingStep
              instance={instance}
              activeLicenses={activeLicenses}
              licenses={allLicenses}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              />
          );

        case 8:
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
