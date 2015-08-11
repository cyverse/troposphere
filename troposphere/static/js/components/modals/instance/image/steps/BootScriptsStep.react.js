define(function(require) {

  var React = require('react/addons'),
      Backbone = require('backbone'),
      actions = require('actions'),
      EditScriptsView = require('components/modals/image_version/scripts/EditScriptsView.react'),
      stores = require('stores');

  return React.createClass({
    displayName: "BootScriptsStep",

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      scripts: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      activeScripts: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    getDefaultProps: function() {
      return {
        scripts: new Backbone.Collection(),
        activeScripts: new Backbone.Collection(),
      };
    },

    getInitialState: function(){
      return {
        scripts: this.props.scripts,
        activeScripts: this.props.activeScripts,

      }
    },

    isSubmittable: function(){
      return true;
    },

    onPrevious: function(){
      this.props.onPrevious({
        activeScripts: this.state.activeScripts
      });
    },

    onNext: function(){
      this.props.onNext({
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
