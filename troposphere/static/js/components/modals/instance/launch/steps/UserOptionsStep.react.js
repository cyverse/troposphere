define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      actions = require('actions'),
      ActionUtils = require('actions/Utils'),
    EditScriptsView = require('components/modals/image_version/scripts/EditScriptsView.react'),
    _ = require('underscore'),
      stores = require('stores');

  return React.createClass({
    displayName: "InstanceLaunchWizardModal-UserOptionsStep",

    propTypes: {
        scripts: React.PropTypes.instanceOf(Backbone.Collection),
        requiredScripts: React.PropTypes.array,
        activeScripts: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        launchOptions: React.PropTypes.object,
        onPrevious: React.PropTypes.func.isRequired,
        onNext: React.PropTypes.func.isRequired
    },

    getDefaultProps: function() {
      return {
        scripts: null,
        activeScripts: new Backbone.Collection(),
        requiredScripts: [],
        launchOptions: {},
      };
    },

    getState: function() {
      var state = this.state;
      if (!state.scripts) {
        state.scripts = stores.ScriptStore.getAll();
      }

      return state;
    },
    updateState: function() {
      if(this.isMounted()) this.setState(this.getState());
    },
    getInitialState: function(){
      var state = {
          scripts: this.props.scripts,
          activeScripts: this.props.activeScripts,
          options: this.props.launchOptions
        };
      return state;
    },

    isSubmittable: function() {
        return true;
    },
    confirm: function() {
        this.props.onNext({
          activeScripts: this.state.activeScripts
        });
    },
    onScriptCreate: function(scriptObj){
      var script = actions.ScriptActions.create({
        title: scriptObj.title,
        type: scriptObj.type,
        text: scriptObj.text
      });
      var scripts = this.state.activeScripts;
      scripts.add(script);
      this.setState({activeScripts: scripts});
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
      if(this.props.requiredScripts &&
        this.props.requiredScripts.map(function (test_script) {test_script.id === script.id})
        ) {
            ActionUtils.displayInfo({message:
                "You cannot remove this script, it is required to run the image."});
            return
        }
      var filteredScripts = this.state.activeScripts.filter(function(bootscript) {
        return bootscript.id !== script.id;
      });
      this.setState({activeScripts:filteredScripts});
    },
    componentDidMount: function () {
      stores.ScriptStore.addChangeListener(this.updateState);

    },

    componentWillUnmount: function () {
      stores.ScriptStore.removeChangeListener(this.updateState);

    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function(){
      this.props.onPrevious({
        activeScripts: this.state.activeScripts
      });
    },

    renderBody: function(){
      if(!this.state.scripts) {
        return (<div className="loading"/>);
      }

      return (
        <div>
          <EditScriptsView
            requiredScripts={this.props.requiredScripts}
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
                {this.renderBody()}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default pull-left" onClick={this.cancel}>
                            <span className="glyphicon glyphicon-chevron-left"></span>
                            Back
                        </button>
                        <button type="button" className="btn btn-primary" onClick={this.confirm} disabled={!this.isSubmittable()}>
                            Continue
                        </button>
                    </div>

                </div>
            );
        }

  });

});
