define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      EditDescriptionView = require('components/images/detail/description/EditDescriptionView.react'),
      CreateLicenseView = require('./CreateLicenseView.react'),
      LicenseMultiSelect = require('components/common/chosen/ChosenMultiFormSelect.react');

  var ENTER_KEY = 13;

  return React.createClass({
    display: "EditLicenseView",
    propTypes: {
      image_version: React.PropTypes.instanceOf(Backbone.Model),
      activeLicenses: React.PropTypes.instanceOf(Backbone.Collection),
      licenses: React.PropTypes.instanceOf(Backbone.Collection),
      onLicenseAdded: React.PropTypes.func.isRequired,
      onLicenseRemoved: React.PropTypes.func.isRequired,
      onCreateNewLicense: React.PropTypes.func.isRequired,
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
      }
    },

    onQueryChange: function(query){
      this.setState({query: query});
    },
    onEditChange: function(truth_value){
      this.setState({isEditingLicenses: truth_value});
    },
    onCreateLicense: function(params) {
      this.setState({isEditingLicenses: false});
      this.params.onCreateNewLicense(params);
    },
    renderLicenseCreateForm: function() {
      return (
        <CreateLicenseView
            onCreateLicense={this.onCreateLicense}
                />
      );
    },
    render: function () {
      var query = this.state.query,
          link,
          licenseView,
          licenses = this.props.licenses;

      if(query){
        licenses = this.props.licenses.filter(function(license){
          return license.get('title').toLowerCase().indexOf(query) >= 0;
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
            onShowingChange={this.onEditChange}
            propertyName={"title"}
            showButtonText="Create New License"
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
