define(function(require) {

  var React = require('react/addons'),
      Backbone = require('backbone'),
      actions = require('actions'),
      EditLicensesView = require('components/modals/image_version/licenses/EditLicensesView.react'),
      stores = require('stores');

  return React.createClass({
    displayName: "LicensingStep",

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      licenses: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      activeLicenses: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    getDefaultProps: function() {
      return {
        licenses: new Backbone.Collection(),
        activeLicenses: new Backbone.Collection(),
      };
    },

    getInitialState: function(){
      return {
        licenses: this.props.licenses,
        activeLicenses: this.props.activeLicenses,
      }
    },

    isSubmittable: function(){
      return true;
    },

    onPrevious: function(){
      this.props.onPrevious({
        activeLicenses: this.state.activeLicenses
      });
    },

    onNext: function(){
      this.props.onNext({
        activeLicenses: this.state.activeLicenses
      });
    },

    onLicenseCreate: function(licenseObj){
      actions.LicenseActions.create({
        title: licenseObj.title,
        type: licenseObj.type,
        text: licenseObj.text
      });
    },

    onLicenseAdded: function(license){
      var licenses = this.state.activeLicenses;
      licenses.add(license);
      this.setState({activeLicenses:licenses});

    },

    onLicenseRemoved: function(license_removed){
      var filteredLicenses = this.state.activeLicenses.filter(function(license) {
        return license.id !== license_removed.id;
      });
      this.setState({activeLicenses:filteredLicenses});

    },

    renderBody: function () {
      return (
        <div>
          <EditLicensesView
            activeLicenses={this.state.activeLicenses}
            licenses={this.state.licenses}
            onLicenseAdded={this.onLicenseAdded}
            onLicenseRemoved={this.onLicenseRemoved}
            onCreateNewLicense={this.onLicenseCreate}
            label={"Licenses Required"}
          />
        </div>
      );
    },

    render: function () {
      return (
        <div>
          <div className="modal-body">
            {this.renderBody()}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.onPrevious}>
              <span className="glyphicon glyphicon-chevron-left"></span>
              Back
            </button>
            <button type="button" className="btn btn-primary cancel-button" onClick={this.onNext} disabled={!this.isSubmittable()}>
              Next
            </button>
          </div>
        </div>
      );
    }

  });

});
