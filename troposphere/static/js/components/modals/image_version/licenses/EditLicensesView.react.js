define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      EditDescriptionView = require('components/images/detail/description/EditDescriptionView.react'),
      LicenseMultiSelect = require('./LicenseMultiSelectAndCreate.react');

  var ENTER_KEY = 13;

  return React.createClass({
    displayName: "EditLicenseView",

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
        query: "",
      }
    },
    onQueryChange: function(query){
      this.setState({query: query});
    },
    onCreateLicense: function(params) {
      this.props.onCreateNewLicense(params);
    },

    render: function () {
      var query = this.state.query,
          link,
          licenseView,
          licenses = this.props.licenses;

      if(query){
        licenses = this.props.licenses.filter(function(license){
          return license.get('title').toLowerCase().indexOf(query.toLowerCase()) >= 0;
        });
        licenses = new Backbone.Collection(licenses);
      }

        licenseView = (
          <LicenseMultiSelect
            models={licenses}
            activeModels={this.props.activeLicenses}
            onModelAdded={this.props.onLicenseAdded}
            onModelRemoved={this.props.onLicenseRemoved}
            onModelCreated={this.onCreateLicense}
            onQueryChange={this.onQueryChange}
            propertyName={"title"}
            showButtonText="Create New License"
            placeholderText="Search by License title..."
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
