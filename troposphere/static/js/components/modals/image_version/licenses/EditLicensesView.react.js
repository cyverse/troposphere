ggdefine(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      EditDescriptionView = require('components/images/detail/description/EditDescriptionView.react'),
      LicenseMultiSelect = require('./LicenseMultiSelect.react');

  var ENTER_KEY = 13;

  return React.createClass({
    display: "EditLicenseView",
    propTypes: {
      activeLicenses: React.PropTypes.instanceOf(Backbone.Collection),
      licenses: React.PropTypes.instanceOf(Backbone.Collection),
      onLicenseAdded: React.PropTypes.func.isRequired,
      onLicenseRemoved: React.PropTypes.func.isRequired,
      onCreateNewLicense: React.PropTypes.func,
      label: React.PropTypes.string.isRequired
    },

    getDefaultProps: function() {
      return {
        activeLicenses: new Backbone.Collection(),
        licenses: new Backbone.Collection()
      }
    },
    getInitialState: function(){
      return {
        isEditingLicenses: false,
        query: "",
        licenseType: "URL",
        licenseURL: "",
        licenseText: "",
      }
    },

    onQueryChange: function(query){
      this.setState({query: query});
    },

    onLicenseTypeChange: function(e) {
      //console.log(e);
    },
    onLicenseURLChange: function(e) {
      //console.log(e);
    },
    onLicenseTextChange: function(e) {
      //console.log(e);
    },
    renderLicenseSelection: function() {
        if(this.state.licenseType == "URL") {
          return (
            <div className='form-group'>
              <label htmlFor='version-version'>License URL</label>
              <input type='text' className='form-control'
                     value={this.state.licenseURL} onChange={this.onLicenseURLChange}/>
            </div>
          );
        } else {
          return (<EditDescriptionView
            title={"Full Text"}
            image={this.props.image}
            value={this.state.licenseText}
            onChange={this.onLicenseTextChange}
            />)
        }
    },
    renderLicenseInputRadio: function() {
      returng (
          <div className="form-group">
            <label for="licenseTypeSelect">Input Type</label>
            <label className="radio-inline">
            <input type="radio" name="inlineRadioOptions" id="licenseTypeURL" value="URL" onChange={this.onLicenseInputTypeChange} />
              URL
            </label>
            <label className="radio-inline">
              <input type="radio" name="inlineRadioOptions" id="LicenseTypeText" value="full_text"  onChange={this.onLicenseInputTypeChange} />
                Full Text
            </label>
            </div>
            );
    },
    renderLicenseTitle: function() {
      return (        <div class="form-group">
          <label for="licenseTitle">License Title</label>
          <input type="email" class="form-control" id="licenseTitle" placeholder="Title" />
        </div>
      );
    },
    renderLicenseCreateForm: function() {
      return (
        <div className="license-input-type-container">
          {this.renderLicenseTitle}
          {this.renderLicenseInputRadio()}
          {this.renderLicenseSelection()}
        </div>
      );
    },
    render: function () {
      var query = this.state.query,
          link,
          licenseView,
          licenses = this.props.licenses;

      if(query){
        licenses = this.props.licenses.filter(function(license){
          return license.get('name').toLowerCase().indexOf(query) >= 0;
        });
        licenses = new Backbone.Collection(licenses);
      }

        licenseView = (
          <LicenseMultiSelect
            models={licenses}
            activeModels={this.props.activeLicenses}
            onModelAdded={this.props.onLicenseAdded}
            onModelRemoved={this.props.onLicenseRemoved}
            onQueryChange={this.onQueryChange}
            placeholderText="Search by License title..."
            renderCreateForm={this.renderLicenseCreateForm}
          />
        );

      return (
        <div className="resource-users">
          <span className='user-title'>{this.props.label}</span>
          {licenseView}
        </div>
      );
    }

  });

});
