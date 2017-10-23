import React from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import $ from "jquery";
import Backbone from "backbone";
import classNames from "classnames";

import ChosenMixinExternal from "components/mixins/ChosenMixinExternal";

let ENTER_KEY = 13;

export default {
    displayName: "ChosenMultiMixinExternal",

    mixins: [ChosenMixinExternal],

    propTypes: {
        placeholderText: React.PropTypes.string,
        models: React.PropTypes.instanceOf(Backbone.Collection),
        activeModels: React.PropTypes.instanceOf(Backbone.Collection),
        requiredModels: React.PropTypes.array,
        onModelAdded: React.PropTypes.func.isRequired,
        onModelRemoved: React.PropTypes.func.isRequired,
        onEnterKeyPressed: React.PropTypes.func,
        width: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            showOptions: false,
            query: ""
        }
    },

    onModelAdded: function(model) {
        this.props.onModelAdded(model);
        this.clearSearchField();
    },

    getDefaultProps: function() {
        return {
            models: new Backbone.Collection(),
            activeModels: new Backbone.Collection(),
            requiredModels: [],
            placeholderText: "Search..."
        }
    },

    onEnter: function(e) {
        if (e.which !== ENTER_KEY) return;

        // Stops the enter event from bubbling out to other elements.
        // If we want to say move focus to the another field on enter, a line break (\n)
        // would be passed to that field causing the line break to be added before the cursor.
        e.preventDefault();
        e.stopPropagation();

        var value = e.target.value;

        if (this.onEnterKeyPressed) {
            this.onEnterKeyPressed(value);
        } else if (this.props.onEnterKeyPressed) {
            this.props.onEnterKeyPressed(e);
        } else {
            //Enter does nothing if neither value is defined..
            return;
        }

        //After callback, assume action Completed clear search.
        this.clearSearchField();
    },
    getFilteredResults: function(models, activeModels) {
        var filteredResults = models.filter(function(model) {
            return activeModels.filter(function(activeModel) {
                return model.id === activeModel.id;
            }).length === 0;
        });
        return filteredResults;
    },

    //
    // Result render helpers
    //

    renderAlreadyAddedAllUsersMatchingQueryListItem: function(query) {
        var phrase = 'All results matching "' + query + '" have been added';
        if (this.getAllAddedMatchingQueryPhrase)
            phrase = this.getAllAddedMatchingQueryPhrase(query);
        return <li className="no-results">
                   {phrase}
               </li>;
    },

    renderAllAddedListItem: function() {
        var phrase = "All results have been added";
        if (this.getAllResultsAddedPhrase)
            phrase = this.getAllResultsAddedPhrase();
        return <li className="no-results">
                   {phrase}
               </li>;
    },
    _mergeModels: function(required_models, active_models) {
        //Required models is a list, active models is a collection..
        //ChosenMixinExternal will expect a collection.
        if (!required_models || required_models.length == 0) {
            if (this.props.activeModels instanceof Array)
                return new Backbone.Collection(activeModels);
            else
                return active_models;
        }

        var activeModels = _.union(
                this.props.requiredModels,
                (this.props.activeModels instanceof Array) ? this.props.activeModels : this.props.activeModels.toJSON()
            ),
            activeCollection = new Backbone.Collection(activeModels);
        return activeCollection;
    },
    //
    // Render
    //
    renderResults: function() {
        var models = this.props.models,
            query = this.state.query,
            activeCollection = this._mergeModels(
                this.props.requiredModels,
                this.props.activeModels),
            selectedModels = activeCollection.map(this.renderSelectedModel),
            results, filteredModels;

        if (!models) {
            results = this.renderLoadingListItem(query);
        } else if (query && models.length < 1) {
            results = this.renderNoResultsForQueryListItem(query);
        } else if (selectedModels.length === 0 && models.length < 1) {
            results = this.renderNoDataListItem();
        } else if (selectedModels.length > 0 && models.length < 1) {
            results = this.renderAllAddedListItem();
        } else {
            // filter out results that have already been added
            filteredModels = this.getFilteredModels();
            if (models.length > 0 && filteredModels.length === 0) {
                results = this.renderAlreadyAddedAllUsersMatchingQueryListItem(query);
            } else {
                results = filteredModels.map(this.renderModel);
            }
        }
        return results;
    },
    getFilteredModels: function() {
        var models = this.props.models,
            query = this.state.query,
            activeCollection = this._mergeModels(
                this.props.requiredModels,
                this.props.activeModels),
            selectedModels = activeCollection.map(this.renderSelectedModel),
            placeholderText = this.props.placeholderText,
            filteredModels;
        filteredModels = models.filter(function(model) {
            return activeCollection.filter(function(activeModel) {
                return model.id === activeModel.id;
            }).length === 0;
        });
        return filteredModels;
    },
    renderChosenSearchSelect: function() {
        var models = this.props.models,
            query = this.state.query,
            activeCollection = this._mergeModels(
                this.props.requiredModels,
                this.props.activeModels),
            selectedModels = activeCollection.map(this.renderSelectedModel),
            placeholderText = this.props.placeholderText,
            filteredModels,
            classes = classNames({
                "chosen-container-external": true,
                "chosen-container-external-multi": true,
                "chosen-with-drop": this.state.showOptions && query,
                "chosen-container-external-active": this.state.showOptions
            }),
            results = this.renderResults();


        return (
        <div className={classes}>
            <ul className="chosen-choices clearfix" onFocus={this.onEnterOptions}>
                {selectedModels}
            </ul>
            <div className="form-group">
                <input type="text"
                    ref="searchField"
                    className="form-control chosen-search-input"
                    placeholder={placeholderText}
                    autoComplete="off"
                    onKeyDown={this.onEnter}
                    onChange={this.filterSearchResults}
                    onFocus={this.onEnterOptions} />
                <div className="chosen-drop">
                    <ul className="chosen-results">
                        {results}
                    </ul>
                </div>
            </div>
        </div>
        );
    }

};

