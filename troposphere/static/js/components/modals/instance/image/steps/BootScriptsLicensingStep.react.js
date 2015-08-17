define(function(require) {

  var React = require('react'),
      Backbone = require('backbone'),
      actions = require('actions'),
      EditScriptsView = require('components/modals/image_version/scripts/EditScriptsView.react'),
      EditLicensesView = require('components/modals/image_version/licenses/EditLicensesView.react'),
      stores = require('stores');

  return React.createClass({
    displayName: "BootScriptsLicensingStep",

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      scripts: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      activeScripts: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      licenses: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      activeLicenses: React.PropTypes.instanceOf(Backbone.Collection).isRequired

    },

    getDefaultProps: function() {
      return {
        licenses: new Backbone.Collection(),
        activeLicenses: new Backbone.Collection(),
        scripts: new Backbone.Collection(),
        activeScripts: new Backbone.Collection(),
      };
    },

    getInitialState: function(){
      return {
        licenses: this.props.licenses,
        activeLicenses: this.props.activeLicenses,
        scripts: this.props.scripts,
        activeScripts: this.props.activeScripts,

      }
    },

    isSubmittable: function(){
      return true;
    },

    onPrevious: function(){
      this.props.onPrevious({
        activeLicenses: this.state.activeLicenses,
        activeScripts: this.state.activeScripts
      });
    },

    onNext: function(){
      this.props.onNext({
        activeLicenses: this.state.activeLicenses,
        activeScripts: this.state.activeScripts
      });
    },

    onScriptCreate: function(scriptObj){
      actions.ScriptActions.create({
        title: scriptObj.title,
        type: scriptObj.type,
        text: scriptObj.text
      });
    },

    onScriptAdded: function(script){
      var scripts = this.state.activeScripts;
      scripts.add(script);
      this.setState({activeScripts:scripts});
      //actions.ImageVersionScriptActions.add({
      //  image_version: this.props.version,
      //  script: script
      //});
    },

    onScriptRemoved: function(script){
      var filteredScripts = this.state.activeScripts.filter(function(bootscript) {
        return bootscript.id !== script.id;
      });
      this.setState({activeScripts:filteredScripts});
      //actions.ImageVersionScriptActions.remove({
      //  image_version: this.props.version,
      //  script: script
      //});
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
          <EditScriptsView
            activeScripts={this.state.activeScripts}
            scripts={this.state.scripts}
            onScriptAdded={this.onScriptAdded}
            onScriptRemoved={this.onScriptRemoved}
            onCreateNewScript={this.onScriptCreate}
            label={"Scripts Required"}
          />
          <hr/>
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
