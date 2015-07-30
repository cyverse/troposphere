define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    stores = require('stores'),

    BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
    BreadcrumbNav = require('components/common/breadcrumb/BreadcrumbNav.react'),

    ApplicationSelectStep = require('./launch/steps/ApplicationSelectStep.react'),
    NameIdentityVersionStep = require('./launch/steps/NameIdentityVersionStep.react'),
    SizeSelectStep = require('./launch/steps/SizeSelectStep.react'),
    ProjectSelectStep = require('./launch/steps/ProjectSelectStep.react'),
    UserOptionsStep = require('./launch/steps/UserOptionsStep.react'),
    AdministratorOptionsStep = require('./launch/steps/AdminOptionsStep.react'),
    ReviewLaunchStep = require('./launch/steps/ReviewLaunchStep.react');

  var APPLICATION_STEP = 0,
    INFORMATION_STEP = 1,
    SIZE_STEP = 2,
    PROJECT_STEP = 3,
    OPTIONS_STEP = 4,
    ADMIN_OPTIONS_STEP = 5,
    REVIEW_STEP = 6;

  return React.createClass({
    mixins: [BootstrapModalMixin],

    propTypes: {
      application: React.PropTypes.instanceOf(Backbone.Model),
      project: React.PropTypes.instanceOf(Backbone.Model),
      onConfirm: React.PropTypes.instanceOf(Backbone.Model),
    },


    getInitialState: function () {
      return {
        application: this.props.application,
        project: this.props.project,
        step: this.props.application ? INFORMATION_STEP : APPLICATION_STEP,
        title: "Application",
        breadcrumbs: [
          {name: "Application", step: APPLICATION_STEP, inactive: this.props.application ? true : false},
          {name: "Version & Provider", step: INFORMATION_STEP},
          {name: "Size", step: SIZE_STEP},
          {name: "Project", step: PROJECT_STEP, inactive: this.props.project ? true : false},
          {name: "Options", step: OPTIONS_STEP, inactive: true},
          {name: "Review", step: REVIEW_STEP}
        ]
      };
    },
    renderApplicationSelect: function () {
      return (
        <ApplicationSelectStep
          application={this.state.application}
          onPrevious={this.cancel}
          onNext={this.onNext}
          />
      );
    },
    renderNameStep: function () {
      return (
        <NameIdentityVersionStep
          application={this.state.application}
          name={this.state.name}
          identity={this.state.identity}
          version={this.state.version}
          onPrevious={this.onPrevious}
          onNext={this.onNext}
          />
      );
    },
    renderSizeStep: function () {
      return (
        <SizeSelectStep
          application={this.state.application}
          identity={this.state.identity}
          size={this.state.size}
          onPrevious={this.onPrevious}
          onNext={this.onNext}
          />
      );
    },
    renderProjectStep: function () {
      return (
        <ProjectSelectStep
          project={this.state.project}
          onPrevious={this.onPrevious}
          onNext={this.onNext}
          onFinished={this.toReview}
          />
      );
    },
    renderUserOptionsStep: function () {
      return (
        <UserOptionsStep
          launchOptions={this.state.launchOptions}
          onPrevious={this.onPrevious}
          onNext={this.onNext}
          onFinished={this.toReview}
          />
      );
    },
    renderStaffOptionsStep: function () {
      return (
        <AdministratorOptionsStep
          launchOptions={this.state.launchOptions}
          onPrevious={this.onPrevious}
          onNext={this.onNext}
          onFinished={this.toReview}
          />
      );
    },
    renderReviewLaunchStep: function () {
      return (
        <ReviewLaunchStep
          launchData={this.state}
          onPrevious={this.onPrevious}
          onNext={this.onCompleted}
          />
      );
    },
    renderBody: function () {
      var step = this.state.step;
      switch (step) {
        case APPLICATION_STEP:
          return this.renderApplicationSelect();
        case INFORMATION_STEP:
          return this.renderNameStep();
        case SIZE_STEP:
          return this.renderSizeStep();
        case PROJECT_STEP:
          return this.renderProjectStep();
        case OPTIONS_STEP:
        //return this.renderUserOptionsStep(); //TODO: Re-enable when 'Boot Scripts', 'Licenses' are added.
        case ADMIN_OPTIONS_STEP:
        //return this.renderStaffOptionsStep(); //TODO: Re-enable when 'Hypervisor-Select', 'No-Deploy' are added.
        case REVIEW_STEP:
          return this.renderReviewLaunchStep();
      }
    },

    hoverTitleChange: function (text) {
      this.setState({title: text});
    },

    changeTitleBack: function () {
      this.setState({title: this.state.breadcrumbs[this.state.step].name});
    },

    renderBreadCrumbTrail: function () {
      var user = stores.ProfileStore.get();
      var self = this;
      var breadcrumbs = this.state.breadcrumbs;

      if (user.get('is_staff') && breadcrumbs[5].step !== 5) {
        breadcrumbs.splice(5, 0, {name: "Admin", step: ADMIN_OPTIONS_STEP, inactive: true});
      }
      breadcrumbs.map(function (breadcrumb, index, array) {
        var state;
        if (breadcrumb.inactive) {
          state = "inactive"
        } else if (breadcrumb.step === self.state.step) {
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
          step={this.state.step}
          onCrumbClick={self.toStep}
          />
      );
      //return (
      //    <ul className="breadcrumb">
      //      <li><a className="crumb" onClick={this.toStep(APPLICATION_STEP)}>Application</a></li>
      //      <li><a className="crumb" onClick={this.toStep(INFORMATION_STEP)}>Basic Information</a></li>
      //      <li><a className="crumb" onClick={this.toStep(SIZE_STEP)}>Size</a></li>
      //      <li><a className="crumb" onClick={this.toStep(PROJECT_STEP)}>Project</a></li>
      //      <li><a className="crumb" onClick={this.toStep(OPTIONS_STEP)}>Options</a></li>
      //      <li><a className="crumb" onClick={this.toStep(REVIEW_STEP)}>Review</a></li>
      //    </ul>
      //);
    },
    render: function () {
      return (
        <div className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header instance-launch">
                {this.renderCloseButton()}
                <strong>Instance Launch Wizard- {this.state.title}</strong>
              </div>
              <div className="modal-section">
                {this.renderBreadCrumbTrail()}
              </div>
              <div className="modal-body">
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

    getState: function () {
      return this.state;
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState());
    },

    componentDidMount: function () {
      stores.ProviderStore.addChangeListener(this.updateState);
      stores.IdentityStore.addChangeListener(this.updateState);
      stores.SizeStore.addChangeListener(this.updateState);
      stores.ProjectStore.addChangeListener(this.updateState);
      stores.ProjectVolumeStore.addChangeListener(this.updateState);
      stores.ProjectInstanceStore.addChangeListener(this.updateState);
      stores.InstanceStore.addChangeListener(this.updateState);
      stores.MaintenanceMessageStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ProviderStore.removeChangeListener(this.updateState);
      stores.IdentityStore.removeChangeListener(this.updateState);
      stores.SizeStore.removeChangeListener(this.updateState);
      stores.ProjectStore.removeChangeListener(this.updateState);
      stores.ProjectVolumeStore.removeChangeListener(this.updateState);
      stores.ProjectInstanceStore.removeChangeListener(this.updateState);
      stores.InstanceStore.removeChangeListener(this.updateState);
      stores.MaintenanceMessageStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function () {
      this.hide();
    },
    onCompleted: function (launch_data) {
      this.hide();
      this.props.onConfirm(launch_data);
    },
    onPrevious: function (data) {
      var previousStep = this.state.step - 1,
        data = data || {},
        state = _.extend({step: previousStep}, data);
      if (this.props.application && this.state.step == INFORMATION_STEP) {
        //Don't go to 'Step 0' if application provided.
        this.cancel()
      }
      if (this.state.step == REVIEW_STEP) {
        //TODO: Remove this when re-adding User/Admin Options
        if (this.props.project) {
          //Skip 'Project Selection' step if project provided.
          state.step = SIZE_STEP;
        } else {
          state.step = PROJECT_STEP;
        }
      }
      state.title = this.state.breadcrumbs[state.step].name;
      this.setState(state);
    },
    onNext: function (data) {
      var nextStep = this.state.step + 1,
        data = data || {},
        state = _.extend({step: nextStep}, data);
      if (this.props.project && state.step == PROJECT_STEP) {
        //Skip to the review step.
        state.step = REVIEW_STEP;
      } else if (this.state.step == PROJECT_STEP) {
        //TODO: Remove this line when re-adding User/Admin Options
        state.step = REVIEW_STEP;
      }
      state.title = this.state.breadcrumbs[state.step].name;
      this.setState(state);
    },
    toReview: function (data) {
      var state = _.extend({step: REVIEW_STEP}, data);
      this.setState(state);
    },
    toStep: function (breadcrumb) {
      this.setState({title: this.state.breadcrumbs[breadcrumb.step].name});
      this.setState({step: breadcrumb.step});
    }
  });

});
