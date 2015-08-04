define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      EditDescriptionView = require('components/images/detail/description/EditDescriptionView.react'),
      ScriptMultiSelect = require('./ScriptMultiSelectAndCreate.react');

  var ENTER_KEY = 13;

  return React.createClass({
    displayName: "EditScriptView",

    propTypes: {
      image_version: React.PropTypes.instanceOf(Backbone.Model),
      activeScripts: React.PropTypes.instanceOf(Backbone.Collection),
      scripts: React.PropTypes.instanceOf(Backbone.Collection),
      onScriptAdded: React.PropTypes.func.isRequired,
      onScriptRemoved: React.PropTypes.func.isRequired,
      onCreateNewScript: React.PropTypes.func.isRequired,
      label: React.PropTypes.string.isRequired
    },

    getDefaultProps: function() {
      return {
        activeScripts: new Backbone.Collection(),
        scripts: new Backbone.Collection()
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
    onCreateScript: function(params) {
      this.props.onCreateNewScript(params);
    },

    render: function () {
      var query = this.state.query,
          link,
          scriptView,
          scripts = this.props.scripts;

      if(query){
        scripts = this.props.scripts.filter(function(script){
          return script.get('title').toLowerCase().indexOf(query.toLowerCase()) >= 0;
        });
        scripts = new Backbone.Collection(scripts);
      }

        scriptView = (
          <ScriptMultiSelect
            models={scripts}
            activeModels={this.props.activeScripts}
            onModelAdded={this.props.onScriptAdded}
            onModelRemoved={this.props.onScriptRemoved}
            onModelCreated={this.onCreateScript}
            onQueryChange={this.onQueryChange}
            propertyName={"title"}
            showButtonText="Create New Script"
            placeholderText="Search by Script title..."
          />
        );

      return (
        <div className="resource-users">
          {
          //<span className='user-title'>{this.props.label}</span>
          }
          {scriptView}
        </div>
      );
    }

  });

});
