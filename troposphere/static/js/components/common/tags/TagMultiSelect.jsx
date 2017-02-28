import React from "react";
import Backbone from "backbone";
import ChosenDropdownTag from "./ChosenDropdownTag";
import ChosenSelectedTag from "./ChosenSelectedTag";
import CreateTagView from "./CreateTagView";
import ChosenMixin from "components/mixins/ChosenMixinExternal";


export default React.createClass({
    displayName: "TagMultiSelect",
    mixins: [ChosenMixin],

    propTypes: {
        tags: React.PropTypes.instanceOf(Backbone.Collection),
        activeModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onQueryChange: React.PropTypes.func.isRequired,
        onModelAdded: React.PropTypes.func.isRequired,
        onModelRemoved: React.PropTypes.func.isRequired,
        //Necessary for modal creation (Where available)
        onCreateNewTag: React.PropTypes.func,
        //Necessary for inline creation (when modals aren't an option)
        onModelCreated: React.PropTypes.func,
    },

    getInitialState: function() {
        return {
            showCreateForm: false,
            tagName: "",
        }
    },

    onEditChange: function() {
        var truth_value = (this.state.showCreateForm) ? false : true;
        this.setState({
            showCreateForm: truth_value
        });
    },

    onCreateTag: function(model) {
        this.props.onModelCreated(model);
        this.setState({
            showCreateForm: false
        });
    },

    getNoResultsPhrase: function(query) {
        return 'No tags found matching "' + query + '". Press enter to create a new tag.';
    },

    getNoDataPhrase: function() {
        return "No tags exist";
    },

    getAllResultsAddedPhrase: function() {
        return "All tags have been added";
    },

    getAllAddedMatchingQueryPhrase: function(query) {
        return 'All tags matching "' + query + '" have been added'
    },

    renderModel: function(tag) {
        return (
        <ChosenDropdownTag key={tag.id}
            tag={tag}
            propertyName={'name'}
            onTagSelected={this.onModelAdded} />
        )
    },

    renderSelectedModel: function(tag) {
        return (
        <ChosenSelectedTag key={tag.id}
            tag={tag}
            propertyName={'name'}
            onRemoveTag={this.props.onModelRemoved} />
        )
    },
    render: function() {
        return (
        <div className="scriptMultiSelectAndCreate">
            {this.renderChosenSearchSelect()}
            {this.renderCreateForm()}
        </div>
        );
    },

    renderCreateForm: function() {
        if (this.state.showCreateForm == false) {
            return (<div className="new-script-form new-item-form" style={{ "visibility": "hidden" }} />);
        } else {
            return (<CreateTagView onCreateTag={this.onCreateTag} tagName={this.state.tagName} />);
        }
    },
    onEnterKeyPressed: function(value) {
        if (!this.state.showOptions || value.trim() == "") {
            return;
        }
        //IF options are showing and results are listed, pick the first one on Enter-pressed.
        var filtered_results = this.getFilteredResults(
            this.props.models,
            this.props.activeModels)
        if (filtered_results && filtered_results.length > 0) {
            this.onModelAdded(filtered_results[0])
            return;
        } else {
            //IF options are showing and NO results are listed,
            // Populate the beginning of the create modal
            if (this.props.onCreateNewTag) {
                this.props.onCreateNewTag(value);
            } else if (this.props.onEnterKeyPressed) {
                this.setState({
                    showCreateForm: true,
                    tagName: value
                });
                this.props.onEnterKeyPressed(value);
            }
        }
        this.clearSearchField();

    },
})
