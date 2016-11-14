import React from "react";
import Backbone from "backbone";
import ScriptMultiSelect from "./ScriptMultiSelectAndCreate";


export default React.createClass({
    displayName: "EditScriptView",

    propTypes: {
        image_version: React.PropTypes.instanceOf(Backbone.Model),
        requiredScripts: React.PropTypes.array,
        activeScripts: React.PropTypes.instanceOf(Backbone.Collection),
        scripts: React.PropTypes.instanceOf(Backbone.Collection),
        onScriptAdded: React.PropTypes.func.isRequired,
        onScriptRemoved: React.PropTypes.func.isRequired,
        onCreateNewScript: React.PropTypes.func.isRequired,
        label: React.PropTypes.string.isRequired
    },

    getDefaultProps: function() {
        return {
            requiredScripts: [],
            activeScripts: new Backbone.Collection(),
            scripts: new Backbone.Collection()
        }
    },
    getInitialState: function() {
        return {
            query: "",
        }
    },
    onQueryChange: function(query) {
        this.setState({
            query: query
        });
    },
    onCreateScript: function(params) {
        this.props.onCreateNewScript(params);
    },

    render: function() {
        var query = this.state.query,
            scriptView,
            scripts = this.props.scripts;

        if (query) {
            scripts = this.props.scripts.filter(function(script) {
                return script.get("title").toLowerCase().indexOf(query.toLowerCase()) >= 0;
            });
            scripts = new Backbone.Collection(scripts);
        }

        scriptView = (
            <ScriptMultiSelect models={scripts}
                activeModels={this.props.activeScripts}
                requiredModels={this.props.requiredScripts}
                onModelAdded={this.props.onScriptAdded}
                onModelRemoved={this.props.onScriptRemoved}
                onModelCreated={this.onCreateScript}
                onQueryChange={this.onQueryChange}
                propertyName={"title"}
                showButtonText="Create New Script"
                placeholderText="Search by Script title..." />
        );

        return (
        <div className="resource-users">
            {scriptView}
        </div>
        );
    }
});
