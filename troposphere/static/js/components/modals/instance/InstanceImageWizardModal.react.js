define(function (require) {

  var React = require('react/addons'),
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

  var IMAGE_INFO_STEP = 1,
      VERSION_INFO_STEP = 2,
      PROVIDER_STEP = 3,
      VISIBILITY_STEP = 4,
      EXCLUDE_FILES_STEP = 5,
      SCRIPTS_STEP = 6,
      LICENSING_STEP = 7,
      REVIEW_STEP = 8;

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

    getInitialState: function () {
      return {
        step: 1,
        name: this.props.instance.get('image').name,
        description: this.props.instance.get('image').description,
        versionName: this.props.versionName || "1.0",
        versionChanges: "",
        imageTags: null,
        providerId: null,
        visibility: "public",
        imageUsers: new Backbone.Collection(),
        activeScripts: new Backbone.Collection(),
        activeLicenses: new Backbone.Collection(),
        filesToExclude: ""
      };
    },

    getState: function () {
      return this.state;
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function () {
      stores.InstanceTagStore.addChangeListener(this.updateState);
      stores.UserStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.InstanceTagStore.removeChangeListener(this.updateState);
      stores.UserStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function () {
      this.hide();
    },

    onReviewImage: function() {
      var step = REVIEW_STEP,
        data = data || {},
        state = _.extend({step: step}, data);
      this.setState(state);
    },

    onRequestImage: function() {
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
        versionName: this.state.versionName,
        versionChanges: this.state.versionChanges,
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

    onPrevious: function (data) {
      var previousStep = this.state.step - 1,
        data = data || {},
        state = _.extend({step: previousStep}, data);
      this.setState(state);
    },

    onNext: function (data) {
      var nextStep = this.state.step + 1,
        data = data || {},
        state = _.extend({step: nextStep}, data);
      this.setState(state);
    },

    //
    // Render
    // ------
    //

    renderBody: function () {
      var instance = this.props.instance,
          step = this.state.step,
          allLicenses = stores.LicenseStore.getAll(),
          activeLicenses = this.state.activeLicenses,
          allScripts = stores.ScriptStore.getAll(),
          activeScripts = this.state.activeScripts;

      switch(step) {
        case IMAGE_INFO_STEP:
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

        case VERSION_INFO_STEP:
          return (
            <VersionInfoStep
              versionName={this.state.versionName}
              versionChanges={this.state.versionChanges}
              instance={instance}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              />
          );

        case PROVIDER_STEP:
          return (
            <ProviderStep
              instance={instance}
              providerId={this.state.providerId}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              />
          );

        case VISIBILITY_STEP:
          return (
            <VisibilityStep
              instance={instance}
              visibility={this.state.visibility}
              imageUsers={this.state.imageUsers}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              onSubmit={this.onReviewImage}
              />
          );

        case EXCLUDE_FILES_STEP:
          return (
            <FilesToExcludeStep
              filesToExclude={this.state.filesToExclude}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              />
          );

        case SCRIPTS_STEP:
          return (
            <BootScriptsStep
              instance={instance}
              activeScripts={activeScripts}
              scripts={allScripts}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              />
          );

        case LICENSING_STEP:
          return (
            <LicensingStep
              instance={instance}
              activeLicenses={activeLicenses}
              licenses={allLicenses}
              onPrevious={this.onPrevious}
              onNext={this.onNext}
              />
          );

        case REVIEW_STEP:
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
      var modalStyle ={
        minHeight: "700px"
      };
      return (
        <div className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content" style={modalStyle}>
              <div className="modal-header">
                {this.renderCloseButton()}
                <h3>{"Image Request"}</h3>
              </div>
              {this.renderBody()}
            </div>
          </div>
        </div>
      );
    }

  });

});
