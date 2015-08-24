define(function (require) {

  var React = require('react/addons'),
      _ = require('underscore'),
      BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
      BreadcrumbNav = require('components/common/breadcrumb/BreadcrumbNav.react'),
      stores = require('stores'),
      ImageInfoStep = require('./image/steps/ImageInfoStep.react'),
      VersionInfoStep = require('./image/steps/VersionInfoStep.react'),
      ProviderStep = require('./image/steps/ProviderStep.react'),
      VisibilityStep = require('./image/steps/VisibilityStep.react'),
      FilesToExcludeStep = require('./image/steps/FilesToExcludeStep.react'),
      BootScriptsAndLicenseStep = require('./image/steps/BootScriptsLicensingStep.react'),
      ReviewStep = require('./image/steps/ReviewStep.react');

  var IMAGE_INFO_STEP = 1,
      VERSION_INFO_STEP = 2,
      PROVIDER_STEP = 3,
      VISIBILITY_STEP = 4,
      EXCLUDE_FILES_STEP = 5,
      SCRIPTS_LICENSE_STEP = 6,
      REVIEW_STEP = 7;

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
        title: "Image Info", // Identical to first breadcrumb name
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
        filesToExclude: "",
        breadcrumbs: [
          {name:"Image Info",step:IMAGE_INFO_STEP},
          {name:"Version Info",step:VERSION_INFO_STEP},
          {name:"Provider",step:PROVIDER_STEP},
          {name:"Privacy",step:VISIBILITY_STEP},
          {name:"Exclude Files",step:EXCLUDE_FILES_STEP},
          {name:"Boot Scripts & Licenses",step:SCRIPTS_LICENSE_STEP},
          {name:"Review",step:REVIEW_STEP}
        ]

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
      stores.ScriptStore.addChangeListener(this.updateState);

    },

    componentWillUnmount: function () {
      stores.InstanceTagStore.removeChangeListener(this.updateState);
      stores.UserStore.removeChangeListener(this.updateState);
      stores.ScriptStore.removeChangeListener(this.updateState);

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
    toStep: function(breadcrumb) {
      this.setState({title: breadcrumb.name});
      this.setState({step: breadcrumb.step});
    },

    onPrevious: function (data) {
      var previousStep = this.state.step - 1,
        data = data || {},
        state = _.extend({step: previousStep, title: previousStep.name}, data);
      this.setState(state);
    },

    onNext: function (data) {
      var nextStep = this.state.step + 1,
        data = data || {},
        state = _.extend({step: nextStep, title: nextStep.name}, data);
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

        case SCRIPTS_LICENSE_STEP:
          return (
            <BootScriptsAndLicenseStep
              instance={instance}
              activeScripts={activeScripts}
              scripts={allScripts}
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
    renderBreadCrumbTrail: function() {
      var user = stores.ProfileStore.get();
      var self = this;
      var breadcrumbs = this.state.breadcrumbs;

      //Add pseudo-property 'state'
      breadcrumbs.map(function(breadcrumb, index, array){
        var state;
        if(
          (typeof breadcrumb.active === "boolean" && !breadcrumb.active) ||
          (typeof breadcrumb.active === "function" && !breadcrumb.active())
        ) {
          state = "inactive"
        } else if(breadcrumb.step === self.state.step) {
          state = "active"
        } else if (breadcrumb.step < self.state.step) {
          state = "available"
        } else {
          state = ""
        }
        breadcrumb.state = state;
      });
      return (<BreadcrumbNav
          breadcrumbs={breadcrumbs}
          onMouseOn={this.hoverTitleChange}
          onMouseOff={this.changeTitleBack}
          step = {this.state.step}
          onCrumbClick={self.toStep}
          />
      );
    },

    hoverTitleChange: function(text){
      this.setState({title: text});
    },

    changeTitleBack: function(){
      var breadcrumb = this.state.breadcrumbs[this.state.step];
      this.setState({title: breadcrumb.name});
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
                <h3>{"Image Request - "+this.state.title}</h3>
              </div>
              <div className="modal-section">
                {this.renderBreadCrumbTrail()}
              </div>
              <div className="modal-container-body">
                {this.renderBody()}
              </div>
            </div>
          </div>
        </div>
      );
    }

  });

});
