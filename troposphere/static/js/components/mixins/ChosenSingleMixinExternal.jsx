import React from "react";
import ReactDOM from "react-dom";
import Glyphicon from "components/common/Glyphicon";
import Backbone from "backbone";
import ChosenDropdown from "components/common/ui/ChosenDropdown";
import classNames from "classnames";
import $ from "jquery";

import ChosenMixinExternal from "components/mixins/ChosenMixinExternal";

let ENTER_KEY = 13;

export default {
    displayName: "ChosenSingleMixinExternal",

    mixins: [ChosenMixinExternal],

    propTypes: {
        models: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        current: React.PropTypes.instanceOf(Backbone.Model),
        searchFieldType: React.PropTypes.string,
        searchField: React.PropTypes.string.isRequired,
        onModelSelected: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            editing: true,
            showOptions: false,
            query: "",
            selectedModel: null
        }
    },

    getDefaultProps: function() {
        return {
            searchFieldType: "startswith",
        }
    },

    onModelSelected: function(model) {
        this.setState({
            editing: false,
            selectedModel: model,
            query: model.get(this.props.searchField)
        });
        this.onLeaveOptions();
        this.props.onModelSelected(model);
    },
    renderModel: function(model) {
        let { selectedModel } = this.state;

        return (
            <ChosenDropdown key={model.id}
                value={model.get(this.props.searchField)}
                isMatch={selectedModel && selectedModel.id == model.id}
                onSelected={() => this.onModelSelected(model) } />
        );
    },
    compareModelWithQuery: function(model, query) {
        let { searchField, searchFieldType } = this.props,
            comp_str = model.get(searchField).toLowerCase(),
            query_str = query.toLowerCase();

        if(searchFieldType == 'startswith') {
            return comp_str.indexOf(query_str) == 0;
        } else if(searchFieldType == 'includes') {
            return comp_str.indexOf(query_str) >= 0;
        } else {
            // Missing/invalid searchFieldType defaults to Exact match
            return comp_str == query_str
        }
    },
    onEditSelected: function() {
        this.setState({
            editing: true,
            selectedModel: null
        });
    },
    getFilteredModels: function() {
        let { models } = this.props,
            { query } = this.state,
            filteredModels,
            self = this;
        if (query) {
            filteredModels = models.filter(function(model) {
                return self.compareModelWithQuery(model, query);
            });
        } else {
            filteredModels = models;
        }
        return filteredModels;
    },
    renderResults: function() {
        /**
         * Will return _content to be displayed_.
         * - Might be an error message
         * - Might be a list of results
         * - Might be a list of results, filtered by query
         */
        var models = this.props.models,
            query = this.state.query,
            filteredModels, results;

        if (!models) {
            results = this.renderLoadingListItem(query);
        } else if (models.length < 1) {
            results = this.renderNoDataListItem();
        } else {
            // Models exist and >1 of them.
            filteredModels = this.getFilteredModels();
            if (filteredModels.length >= 1) {
                //Normal operation:
                // >1 models exist and although a
                // query may have filtered some models,
                // filteredModels still has results.
                results = filteredModels.map(this.renderModel);
            } else {
                results = this.renderNoResultsForQueryListItem(query);
            }
        }
        return results;
    },
    //
    // Render
    //
    renderChosenSearchSelect: function() {
        var { showOptions, query }= this.state,
            classes = classNames({
                "chosen-container-external": true,
                "chosen-container-external-single": true,
                "chosen-with-drop": showOptions && query,
                "chosen-container-external-active": showOptions
            });

        return (
            <div className={classes}>
              {this.renderSelectedModel()}
              {this.renderEditModel()}
            </div>
        );
    },
    renderSelectedModel: function() {
        let { searchField } = this.props,
            { editing, selectedModel } = this.state,
            editStyle = {
                marginLeft: "9px",
            };

        if(editing) {
            return;
        }
        return (
          <a className="chosen-single" onClick={this.onEditSelected}>
            <span>
                {selectedModel.get(searchField)}
            </span>
            <Glyphicon name="pencil" style={editStyle}/>
          </a>
        );
    },

    renderEditModel: function() {
        var { editing, query } = this.state,
            { placeholderText } = this.props,
            classes = classNames({
                "chosen-container-external": true,
                "chosen-container-external-single": true,
                "chosen-with-drop": this.state.showOptions && query,
                "chosen-container-external-active": this.state.showOptions
            }),
            results;
        if (!editing) {
            return;
        }
        results = this.renderResults();
        return (
          <div>
            <div className="form-group chosen-search">
                <input
                    className="form-control chosen-search-input"
                    ref="searchField"
                    type="text"
                    autoComplete="off"
                    placeholder={placeholderText}
                    value={query}
                    tabIndex="2"
                    onKeyDown={this.onEnterKeyPressed}
                    onChange={this.filterSearchResults}
                    onFocus={this.onEnterOptions} />
            </div>
            <div className="chosen-drop">
              <ul className="chosen-results">
                  {results}
              </ul>
            </div>
          </div>
        );
    },

    render: function() {
        return (
        <div className="singleSelect">
            {this.renderChosenSearchSelect()}
        </div>
        );
    },

    onEnterKeyPressed: function(e) {
        if (e.which !== ENTER_KEY) return;
        // Stops the enter event from bubbling out to other elements.
        e.preventDefault();
        e.stopPropagation();
        var value = e.target.value;
        if (!this.state.showOptions || value.trim() == "") {
            return;
        }
        //IF options are showing and results are listed, pick the first one on Enter-pressed.
        var filtered_results = this.getFilteredModels();
        if (filtered_results && filtered_results.length > 0) {
            this.onModelSelected(filtered_results[0])
            return;
        }
        this.clearSearchField();
    }

};


