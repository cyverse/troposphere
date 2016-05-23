define(function (require) {

  var React = require('react/addons'),
      moment = require('moment'),
      stores = require('stores'),
      actions = require('actions'),
      BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
      VersionName = require('../instance/image/components/VersionName.react'),
      VersionChanges = require('../instance/image/components/VersionChangeLog.react'),
      EditAvailabilityView = require('./availability/EditAvailabilityView.react'),
      EditDescriptionView = require('components/images/detail/description/EditDescriptionView.react'),
      InteractiveDateField = require('components/common/InteractiveDateField.react'),
      EditMembershipView = require('./membership/EditMembershipView.react'),
      EditLicensesView = require('./licenses/EditLicensesView.react'),
      EditScriptsView = require('./scripts/EditScriptsView.react'),
      EditMinimumRequirementsView = require('./requirements/EditMinimumRequirementsView.react'),
      ImageSelect = require('components/modals/image_version/ImageSelect.react');

  return React.createClass({
    displayName: "ImageVersionEditModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
      version: React.PropTypes.object.isRequired,
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    getInitialState: function () {
      var version = this.props.version,
         parent_version = version.get('parent');


      return {
        showOptions: false,
        cpuMinVal: 1,
        memMinVal: 1,
        cpuMaxVal: 16,
        memMaxVal: 32,
        version: version,
        versionImage: this.props.image,
        versionName: version.get('name'),
        versionChangeLog: (version.get('change_log') == null) ? "" : version.get('change_log'),
        versionStartDate: (version.get('start_date') == null) ? "" : version.get('start_date'),
        versionEndDate: (version.get('end_date') == null) ? "" : version.get('end_date'),
        versionCanImage: version.get('allow_imaging'),
        versionParentID: (parent_version == null) ? "" : parent_version.id,
        versionLicenses: null,
        versionScripts: null,
        versionMemberships: null,
        versionMinCPU: (version.get('min_cpu') == null) ? 0 : version.get('min_cpu'),
        // display memory as GB
        versionMinMem: (version.get('min_mem') == null) ? 0 : version.get('min_mem') / 1024
      }
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState());
    },

    getState: function() {
      return this.state;
    },

    componentDidMount: function () {
      stores.ImageStore.addChangeListener(this.updateState);
      stores.UserStore.addChangeListener(this.updateState);
      stores.MembershipStore.addChangeListener(this.updateState);
      stores.ScriptStore.addChangeListener(this.updateState);
      stores.LicenseStore.addChangeListener(this.updateState);
      stores.ImageVersionStore.addChangeListener(this.updateState);
      stores.ImageVersionMembershipStore.addChangeListener(this.updateState);
      stores.ImageVersionScriptStore.addChangeListener(this.updateState);
      stores.ImageVersionLicenseStore.addChangeListener(this.updateState);
      stores.ProviderMachineStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.ImageStore.removeChangeListener(this.updateState);
      stores.UserStore.removeChangeListener(this.updateState);
      stores.MembershipStore.removeChangeListener(this.updateState);
      stores.LicenseStore.removeChangeListener(this.updateState);
      stores.ScriptStore.removeChangeListener(this.updateState);
      stores.ImageVersionStore.removeChangeListener(this.updateState);
      stores.ImageVersionMembershipStore.removeChangeListener(this.updateState);
      stores.ImageVersionLicenseStore.removeChangeListener(this.updateState);
      stores.ImageVersionScriptStore.removeChangeListener(this.updateState);
      stores.ProviderMachineStore.removeChangeListener(this.updateState);
    },

    //TODO: Pull this out to commons
    valid_date: function (date_stamp) {
      if (date_stamp === "") return true;
      var the_date = Date.parse(date_stamp);
      return !isNaN(the_date);
    },

    isSubmittable: function(){
      var hasVersionName   = !!this.state.versionName;
      var hasChangeLog = !!this.state.versionChangeLog;
      var validEndDate = !!this.valid_date(this.state.versionEndDate);
      var validRequirements = this.checkValidMem() && this.checkValidCPU();
      return hasVersionName && hasChangeLog && validEndDate && validRequirements;
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
      this.props.onConfirm(
        this.props.version,
        this.state.versionName,
        this.state.versionChangeLog,
        this.state.versionEndDate,
        this.state.versionCanImage,
        this.state.versionImage,
        this.state.versionMinCPU,
        // convert RAM to MB
        this.state.versionMinMem * 1024
      );
    },

    //
    // Custom Modal Callbacks
    // ----------------------
    //

    // todo: I don't think there's a reason to update state unless
    // there's a risk of the component being re-rendered by the parent.
    // Should probably verify this behavior, but for now, we play it safe.
    onVersionChange: function (e) {
      this.setState({versionName: e.target.value});
    },

    onEndDateChange: function (value) {
      this.setState({versionEndDate: value});
    },
    onUncopyableSelected: function (e) {
      var uncopyable = (e.target.checked);
      this.setState({versionCanImage: uncopyable});
    },

    onImageSelected: function (image_id) {
      var image = stores.ImageStore.get(image_id);
      this.setState({versionImage: image});
    },

    onMembershipChanged: function (membership_list) {
      this.setState({versionMembership: membership_list});
    },

    //
    //
    // Render
    // ------
    //

    handleNameChange: function(name){
      this.setState({versionName: name});
    },
    handleDescriptionChange: function(description){
      this.setState({versionChangeLog: description});
    },
    onOptionsChange: function() {
      this.setState({showOptions: !this.state.showOptions});
    },
    onScriptCreate: function(scriptObj){
      actions.ScriptActions.create_AddToImageVersion(this.props.version, {
        title: scriptObj.title,
        type: scriptObj.type,
        text: scriptObj.text
      });
    },

    onScriptAdded: function(script){
      actions.ImageVersionScriptActions.add({
        image_version: this.props.version,
        script: script
      });
    },

    onScriptRemoved: function(script){
      actions.ImageVersionScriptActions.remove({
        image_version: this.props.version,
        script: script
      });
    },

    onLicenseCreate: function(licenseObj){
      actions.LicenseActions.create_AddToImageVersion(this.props.version, {
        title: licenseObj.title,
        type: licenseObj.type,
        text: licenseObj.text
      });
    },

    onLicenseAdded: function(license){
      actions.ImageVersionLicenseActions.add({
        image_version: this.props.version,
        license: license
      });
    },

    onLicenseRemoved: function(license){
      actions.ImageVersionLicenseActions.remove({
        image_version: this.props.version,
        license: license
      });
    },

    onMembershipAdded: function(membership){
      actions.ImageVersionMembershipActions.add({
        image_version: this.props.version,
        group: membership
      });
    },

    onMembershipRemoved: function(membership){
      actions.ImageVersionMembershipActions.remove({
        image_version: this.props.version,
        group: membership
      });
    },

    onCPUChange: function(e){
      // Only accept positive integers
      if(Number(e.target.value) && e.target.value > 0){
        this.setState({versionMinCPU: Number(e.target.value)});
      }
      else{
        this.setState({versionMinCPU: 0});
      }
    },

    onMemChange: function(e){
      // Only accept positive integers
      if(Number(e.target.value) && e.target.value > 0){
        this.setState({versionMinMem: Number(e.target.value)});
      }
      else{
        this.setState({versionMinMem: 0});
      }
    },

    checkValidMem: function(){
      var curMemVal = this.state.versionMinMem,
        memMinVal = this.state.memMinVal,
        memMaxVal = this.state.memMaxVal;

      return (!curMemVal || (curMemVal >= memMinVal && curMemVal <= memMaxVal));
    },


    checkValidCPU: function(){
      var curCPUVal = this.state.versionMinCPU,
          cpuMinVal = this.state.cpuMinVal,
          cpuMaxVal = this.state.cpuMaxVal;

      return (!curCPUVal || (curCPUVal >= cpuMinVal && curCPUVal <= cpuMaxVal));
    },

    renderBody: function() {
      var applicationView, availabilityView, canImageView, nameView, descriptionView,
        startDateView, endDateView, membershipView, licensesView, scriptsView;

      var name = this.state.versionName,
        created = this.state.versionStartDate.format("MMM D, YYYY hh:mm a"),
        ended,
        advancedOptions,
        optionsButtonText = (this.state.showOptions) ? "Hide Advanced Options" : "Advanced Options",
        membershipsList = stores.MembershipStore.getAll(),
        licensesList = stores.LicenseStore.getAll(),
        activeLicensesList = stores.ImageVersionLicenseStore.getLicensesFor(this.props.version),
        scriptsList = stores.ScriptStore.getAll(),
        activeScriptsList = stores.ImageVersionScriptStore.getScriptsFor(this.props.version),
        versionMembers = stores.ImageVersionMembershipStore.getMembershipsFor(this.props.version);

      if(this.state.versionEndDate
        && this.state.versionEndDate._isAMomentObject
        && this.state.versionEndDate.isValid()) {
        ended = this.state.versionEndDate.format("MMM D, YYYY hh:mm a");
      } else {
        ended = this.state.versionEndDate;
      }

      if(!name) {
          return (<div className="loading"/>);
      }
      licensesView = (
        <EditLicensesView
          activeLicenses={activeLicensesList}
          licenses={licensesList}
          onLicenseAdded={this.onLicenseAdded}
          onLicenseRemoved={this.onLicenseRemoved}
          onCreateNewLicense={this.onLicenseCreate}
          label={"Licenses Required"}
          />
      );
      scriptsView = (
        <EditScriptsView
          activeScripts={activeScriptsList}
          scripts={scriptsList}
          onScriptAdded={this.onScriptAdded}
          onScriptRemoved={this.onScriptRemoved}
          onCreateNewScript={this.onScriptCreate}
          label={"Scripts Required"}
          />
      );
      nameView = (
        <VersionName
               update={true}
               value={this.state.versionName}
               onChange={this.handleNameChange}
            />
      );
      descriptionView = (
        <VersionChanges
          value={this.state.versionChangeLog}
          onChange={this.handleDescriptionChange}
          />
      );
      availabilityView = (<EditAvailabilityView
        image={this.props.image}
        version={this.props.version}
        />);
      if(this.props.image.get('is_public')) {
        membershipView = (<div>
          Here lies a pretty view telling users
          they can add/edit/remove users they shared a
          specific version with.. ONLY IF that image is private
        </div>)
      } else {
        membershipView = (<EditMembershipView
          memberships={membershipsList}
          activeMemberships={versionMembers}
          onMembershipAdded={this.onMembershipAdded}
          onMembershipRemoved={this.onMembershipRemoved}
          label={"Version Shared With:"}
          />);
      }
      applicationView = (
        <div className="application-select-container">
        <ImageSelect
          imageId={this.state.versionImage.id}
          onChange={this.onImageSelected}
          />
        </div>
      );
      //FUTURE_keyTODO: Pull this functionality out if you use it anywhere else..
      endDateView = (<InteractiveDateField
              value={ended}
              labelText={"Version End-dated On"}
              onChange={this.onEndDateChange}
              />);
      startDateView = (<div className='form-group'>
          <label htmlFor='version-version'>Version Created On</label>
          <input type='text' className='form-control' value={created} readOnly={true} editable={false}/>
        </div>
      );
      canImageView = (<div className='form-group checkbox'>
          <label htmlFor='version-uncopyable'>
            <input type='checkbox' className='form-control'
                   checked={this.state.versionCanImage}
                   onChange={this.onUncopyableSelected}/>
          </label>
        </div>
      );
      minimumRequirementsView = (<EditMinimumRequirementsView
        cpu={this.state.versionMinCPU}
        mem={this.state.versionMinMem}
        onCPUChange={this.onCPUChange}
        onMemChange={this.onMemChange}
        memMinVal={this.state.memMinVal}
        memMaxVal={this.state.memMaxVal}
        cpuMinVal={this.state.cpuMinVal}
        cpuMaxVal={this.state.cpuMaxVal}
        checkValidCPU={this.checkValidCPU}
        checkValidMem={this.checkValidMem}
      />);
      if(this.state.showOptions) {
        advancedOptions = (
          <div className='advanced-options' >
            {availabilityView}
            <hr />
            {membershipView}
            <hr />
            {licensesView}
            <hr />
            {scriptsView}
            <hr />
            {applicationView}
            <hr />
            {minimumRequirementsView}
          </div>
        );
      } else {
        advancedOptions = null;
      }

      return (
        <div role='form'>
          {nameView}
          <hr />
          {descriptionView}
          <hr />
          {
            //TODO: implement 'allow Imaging' in the next iteration
            //canImageView
          }
          {startDateView}
          {endDateView}
          <hr />
          <div className="form-group clearfix">
            <button type="button" className="btn btn-default pull-right"
                    onClick={this.onOptionsChange}>
              {optionsButtonText} <span className="caret"></span>
            </button>
          </div>
          {advancedOptions}
        </div>
      );
    },

    renderMember: function(member) {
      return (<li>{member}</li>);
    },

    renderAddMember: function() {
      return (<li>"Add New Membership"</li>);
    },

    render: function () {
      var images = stores.ImageStore.getAll(),
        providers = stores.ProviderStore.getAll();


      var version = this.props.version,
        end_date = version.get('end_date'),
        versionId = version.id;

      if (!end_date) {
        end_date = ""
      }

      return (
        <div className="modal fade">
          <div className="modal-dialog">
            <div id="ImageVersionEditModal" className="modal-content">
              <div className="modal-header">
                {this.renderCloseButton()}
                <h2>Edit Image Version</h2>
              </div>
              <div className="modal-body">
                {this.renderBody()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

  });

});
