define(function(require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    modals = require('modals'),
    stores = require('stores'),

    BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
    BreadcrumbNav = require('components/common/breadcrumb/BreadcrumbNav.react'),

    ImageSelectStep = require('./launch/steps/ImageSelectStep.react'),
    NameIdentityVersionStep = require('./launch/steps/NameIdentityVersionStep.react'),
    SizeSelectStep = require('./launch/steps/SizeSelectStep.react'),
    ProjectSelectStep = require('./launch/steps/ProjectSelectStep.react'),
    UserOptionsStep = require('./launch/steps/UserOptionsStep.react'),
    AdministratorOptionsStep = require('./launch/steps/AdminOptionsStep.react'),
    LicensingStep = require('./launch/steps/LicensingStep.react'),
    ReviewLaunchStep = require('./launch/steps/ReviewLaunchStep.react');

  var IMAGE_STEP = 0,
      INFORMATION_STEP = 1,
      SIZE_STEP = 2,
      PROJECT_STEP = 3,
      OPTIONS_STEP = 4,
      LICENSE_STEP = 5,
      REVIEW_STEP = 6;

  return React.createClass({
    mixins: [BootstrapModalMixin],
    displayName: "InstanceLaunchWizardModal",

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model),
      project: React.PropTypes.instanceOf(Backbone.Model),
      onConfirm: React.PropTypes.func.isRequired,
    },

    onRequestResources: function(){
      // Launching a resource request modal will eat the current modal. We need to pass this.cancel as a prop
      // in order to properly unmount the whole modal, not just the current step component.
      this.cancel();
      modals.HelpModals.requestMoreResources();
    },

    isLicenseStepActive: function() {
      state = this.getState();
      if (state.version
        && state.version.get('licenses')
        && state.version.get('licenses').length > 0) {
        return true;
      } else {
        return false;
      }
    },
    isOptionsStepActive: function() {
      state = this.getState();
      if (state.showOptions === true) {
        return true;
      } else {
        return false;
      }
    },
    renderImageSelect: function() {
      return (
                <ImageSelectStep
                    image={this.state.image}
                            onPrevious={this.cancel}
                            onNext={this.onNext}
                />
      );
    },
    renderNameStep: function() {
      return (
                <NameIdentityVersionStep
                    image={this.state.image}
                    name={this.state.name}
                    identity={this.state.identity}
                    version={this.state.version}
                    onRequestResources={this.onRequestResources}
                    onPrevious={this.onPrevious}
                    onNext={this.onNext}
                />
      );
    },
    renderSizeStep: function() {
        return (
                <SizeSelectStep
                    image={this.state.image}
                    identity={this.state.identity}
                    version={this.state.version}
                    size={this.state.size}
                    onRequestResources={this.onRequestResources}
                    onPrevious={this.onPrevious}
                    onNext={this.onNext}
                />
      );
    },
    renderProjectStep: function() {
        return (
                <ProjectSelectStep
                    project={this.state.project}
                    onPrevious={this.onPrevious}
                    onNext={this.onNext}
                />
              );
    },
    renderUserOptionsStep: function() {
      var allScripts = this.state.scripts || stores.ScriptStore.getAll(),
      requiredScripts = (this.state.version ? this.state.version.get('scripts') : null) || [],
      activeScripts = this.state.activeScripts || new Backbone.Collection();
      return (
                <UserOptionsStep
                    launchOptions={this.state.launchOptions}
                    scripts={allScripts}
                    activeScripts={activeScripts}
                    requiredScripts={requiredScripts}
                    onPrevious={this.onPrevious}
                    onNext={this.onNext}
                />
              );
    },
    renderStaffOptionsStep: function() {
      return (
        <AdministratorOptionsStep
          launchOptions={this.state.launchOptions}
          onPrevious={this.onPrevious}
          onNext={this.onNext}
          onFinished={this.toReview}
        />
      );
    },
    renderReviewLaunchStep: function() {
      return (
        <ReviewLaunchStep
          launchData={this.state}
          onPrevious={this.onPrevious}
          onNext={this.onCompleted}
          onRequestResources={this.onRequestResources}
          toAdvancedOptions={this.toAdvancedOptions}
        />
      );
    },
    renderLicenseStep: function() {
      return (
        <LicensingStep
          licenses={this.state.version.get('licenses')}
          onPrevious={this.onPrevious}
          onNext={this.onNext}
        />
      );
    },
    renderBody: function() {
      var step = this.state.step;
        switch(step) {
          case IMAGE_STEP:
          return this.renderImageSelect();
        case INFORMATION_STEP:
          return this.renderNameStep();
        case SIZE_STEP:
          return this.renderSizeStep();
        case PROJECT_STEP:
          return this.renderProjectStep();
        case OPTIONS_STEP:
            return this.renderUserOptionsStep();
        case LICENSE_STEP:
          return this.renderLicenseStep();
        case REVIEW_STEP:
          return this.renderReviewLaunchStep();
      }
    },

    hoverTitleChange: function(text) {
      this.setState({title: text});
    },

    changeTitleBack: function() {
      this.setState({title: this.state.breadcrumbs[this.state.step].name});
    },

    renderBreadCrumbTrail: function() {
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
    render: function() {
      return (
        <div className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header instance-launch">
                {this.renderCloseButton()}
                <strong>Instance Launch Wizard- {this.state.title}</strong>
              </div>
              <div className="modal-body">
                <div className="clearfix modal-section">
                    {this.renderBreadCrumbTrail()}
                </div>
                {this.renderBody()}
              </div>
            </div>
          </div>
        </div>
      );
    },

    //
    // Mounting & State
    // ----------------
    //
    getInitialState: function(){
      var image = this.props.image,
        project = this.props.project;
      return {
        image: image,
        project: project,
        step: image ? INFORMATION_STEP : IMAGE_STEP,
        title: "Image",
        breadcrumbs: [
          {name:"Image",step:IMAGE_STEP, active:this.props.image ? false : true},
          {name:"Version & Provider",step:INFORMATION_STEP, active: true},
          {name:"Size",step:SIZE_STEP, active: true},
          {name:"Project",step:PROJECT_STEP, active:this.props.project ? false : true},
          {name:"Options",step:OPTIONS_STEP, active: false},
          {name:"Licensing",step:LICENSE_STEP, active:this.isLicenseStepActive},
          {name:"Review",step:REVIEW_STEP, active: true}
        ],
      };
    },

    getState: function() {
      return this.state;
    },

    updateState: function() {
      if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function() {
      stores.ProviderStore.addChangeListener(this.updateState);
      stores.IdentityStore.addChangeListener(this.updateState);
      stores.SizeStore.addChangeListener(this.updateState);
      stores.ProjectStore.addChangeListener(this.updateState);
      stores.ProjectVolumeStore.addChangeListener(this.updateState);
      stores.ProjectInstanceStore.addChangeListener(this.updateState);
      stores.InstanceStore.addChangeListener(this.updateState);
      stores.ImageVersionStore.addChangeListener(this.updateState);
      stores.MaintenanceMessageStore.addChangeListener(this.updateState);
      stores.ScriptStore.addChangeListener(this.updateState);
      stores.LicenseStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
      stores.ProviderStore.removeChangeListener(this.updateState);
      stores.IdentityStore.removeChangeListener(this.updateState);
      stores.SizeStore.removeChangeListener(this.updateState);
      stores.ProjectStore.removeChangeListener(this.updateState);
      stores.ProjectVolumeStore.removeChangeListener(this.updateState);
      stores.ProjectInstanceStore.removeChangeListener(this.updateState);
      stores.InstanceStore.removeChangeListener(this.updateState);
      stores.ImageVersionStore.removeChangeListener(this.updateState);
      stores.MaintenanceMessageStore.removeChangeListener(this.updateState);
      stores.ScriptStore.removeChangeListener(this.updateState);
      stores.LicenseStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
      this.hide();
    },
    onCompleted: function(launch_data) {
      this.hide();
      this.props.onConfirm(launch_data);
    },
    onPrevious: function(data) {
        var previousStep = this.getPrevStep(this.state.step);
        if (previousStep === undefined) {
            this.cancel();
            return;
        }
        var data = data || {},
            state = _.extend({step: previousStep}, data);
        if(this.state.step == REVIEW_STEP) {
            //TODO: Remove this when re-adding User/Admin Options
            if(this.props.project) {
                //Skip 'Project Selection' step if project provided.
                state.step = SIZE_STEP;
            } else {
                state.step = PROJECT_STEP;
            }
        }
        state.title = this.state.breadcrumbs[state.step].name;
        this.setState(state);
    },
    getPrevStep: function(current_step) {
      var prevStep = current_step,
          breadcrumb;

      while(true) {
        prevStep = prevStep - 1;
        if (prevStep < 0) {
            return undefined;
          // throw "Unexpected behavior: prev step < 0";
        }
        breadcrumb = this.state.breadcrumbs[prevStep];
        if(
          (typeof breadcrumb.active === "boolean" && !breadcrumb.active) ||
          (typeof breadcrumb.active === "function" && !breadcrumb.active())
        ) {
          //Skip this, it's inactive
          continue;
        }
        return breadcrumb.step;
      }
    },
    getNextStep: function(current_step) {
      var nextStep = current_step + 1,
          final_step = this.state.breadcrumbs.length - 1,
          breadcrumb,
          active;

      do {
        if (nextStep > final_step) {
          throw "Unexpected behavior: 'next' step > final step";
        }
        breadcrumb = this.state.breadcrumbs[nextStep];
        active =
            typeof breadcrumb.active === "boolean"
            ? breadcrumb.active
            : breadcrumb.active();

        if (active)
            return breadcrumb.step;
      } while (nextStep++)

    },
    onNext: function (data) {
      var nextStep = this.getNextStep(this.state.step),
        data = data || {},
        state = _.extend({step: nextStep}, data);

      state.title = this.state.breadcrumbs[nextStep].name;
      this.setState(state);
    },
    toReview: function(data) {
        var state = _.extend({step: REVIEW_STEP}, data);
        this.setState(state);
    },
    activateBreadcrumb: function(index, activeTruth) {
      var breadcrumbs = this.state.breadcrumbs,
      crumb = breadcrumbs[index];
      crumb.state = activeTruth ? "active" : "inactive";
      this.state.breadcrumbs[index] = crumb;
      return crumb;
    },
    toAdvancedOptions: function(data) {
      var crumb = this.activateBreadcrumb(OPTIONS_STEP, true);
      var state = _.extend(data, {step: OPTIONS_STEP, title: crumb.name});
      this.setState(state);
    },
    toStep: function(breadcrumb) {
       this.setState({title: breadcrumb.name});
       this.setState({step: breadcrumb.step});
    }
  });

});
