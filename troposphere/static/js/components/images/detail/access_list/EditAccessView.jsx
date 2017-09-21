import React from "react";
import Backbone from "backbone";
import PatternMatchMultiSelectAndCreate  from "./PatternMatchMultiSelectAndCreate";


export default React.createClass({
    displayName: "EditAccessView",

    propTypes: {
        activeAccessList: React.PropTypes.instanceOf(Backbone.Collection),
        allPatterns: React.PropTypes.instanceOf(Backbone.Collection),
        onAccessAdded: React.PropTypes.func.isRequired,
        onAccessRemoved: React.PropTypes.func.isRequired,
        onCreateNewPattern: React.PropTypes.func.isRequired,
    },

    getDefaultProps: function() {
        return {
            activeAccessList: new Backbone.Collection(),
            allPatterns: new Backbone.Collection()
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
    getPatternPropertyName: function(patternMatch) {
        let prefix = (patternMatch.get('allow_access')) ? "ALLOW:" : "DENY:";
        return prefix + " " + patternMatch.get('pattern');
    },
    onCreatePattern: function(params) {
        this.props.onCreateNewPattern(params);
    },

    render: function() {
        var query = this.state.query,
            accessListView,
            accessList,
            allPatterns = this.props.allPatterns;

        //TODO: Change to a stores query
        if (query) {
            accessList = allPatterns.filter(function(pattern_match) {
                return pattern_match.get("pattern").toLowerCase().indexOf(query.toLowerCase()) >= 0;
            });
            accessList = new Backbone.Collection(accessList);
        } else {
            accessList = allPatterns
        }

        accessListView = (
            <PatternMatchMultiSelectAndCreate models={accessList}
                activeModels={this.props.activeAccessList}
                onModelAdded={this.props.onAccessAdded}
                onModelRemoved={this.props.onAccessRemoved}
                onModelCreated={this.onCreatePattern}
                onQueryChange={this.onQueryChange}
                propertyCB={this.getPatternPropertyName}
                showButtonText="Create New Access Pattern"
                placeholderText="Search by Access Pattern... (ex: wildcard*)" />
        );

        return (
        <div className="resource-users">
            {accessListView}
        </div>
        );
    }
});

