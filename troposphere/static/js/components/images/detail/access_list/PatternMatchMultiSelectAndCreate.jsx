import React from "react";
import Backbone from "backbone";
import ChosenDropdownItem from "components/common/chosen/ChosenDropdownItem";
import ChosenSelectedItem from "components/common/chosen/ChosenSelectedItem";
import ChosenMixinExternal from "components/mixins/ChosenMixinExternal";
import CreatePatternMatchView from "./CreatePatternMatchView";


export default React.createClass({
    displayName: "PatternMatchMultiSelectAndCreate",

    mixins: [ChosenMixinExternal],

    propTypes: {
        //Mixin-requires:
        models: React.PropTypes.instanceOf(Backbone.Collection),
        activeModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        propertyName: React.PropTypes.string,
        propertyCB: React.PropTypes.func,
        onQueryChange: React.PropTypes.func.isRequired,
        onModelAdded: React.PropTypes.func.isRequired,
        onModelRemoved: React.PropTypes.func.isRequired,
        //Create-related:
        //  Listeners
        onModelCreated: React.PropTypes.func.isRequired,
        //  Theme-related
        titleText: React.PropTypes.string,
        hideButtonText: React.PropTypes.string,
        showButtonText: React.PropTypes.string,
        createButtonText: React.PropTypes.string,

    },

    getInitialState: function() {
        return {
            showCreateForm: this.props.showCreateForm,
            pattern: "",
            allowAccess: true,
        }
    },

    getDefaultProps: function() {
        return {
            titleText: "Allow access by pattern",
            createButtonText: "Add Access",
            showButtonText: "Create New Access Pattern",
            hideButtonText: "Cancel",
            showCreateForm: false,
            width: "550px",
        }
    },
    onEnterKeyPressed: function(value) {
        if (this.state.showOptions) {
            //IF options are showing and results are listed, pick the first one on Enter-pressed.
            var filtered_results = this.getFilteredResults(
                this.props.models,
                this.props.activeModels)
            if (filtered_results && filtered_results.length > 0) {
                this.onModelAdded(filtered_results[0])
            } else {
                this.setState({
                    showCreateForm: true,
                    pattern: value
                });
                if (this.props.onEnterKeyPressed) {
                    this.props.onEnterKeyPressed(value);
                    this.clearSearchField();
                }

            }
        }

    },
    renderCreateForm: function(createButtonText) {
        if (this.state.showCreateForm == false) {
            return (<div className="new-pattern_match-form new-item-form" style={{ "visibility": "hidden" }} />);
        } else {
            return (<CreatePatternMatchView onCreatePatternMatch={this.onCreatePatternMatch} allowAccess={this.state.allowAccess} pattern={this.state.pattern} />);
        }
    },
    onEditChange: function(e) {
        var truth_value = (this.state.showCreateForm) ? false : true;
        this.setState({
            showCreateForm: truth_value
        });
    },
    isSubmittable: function() {
        return this.props.isSubmittable(this.state);
    },
    onCreatePatternMatch: function(model) {
        this.props.onModelCreated(model);
        this.setState({
            showCreateForm: false
        });
    },

    getNoResultsPhrase: function(query) {
        return 'No patterns found matching "' + query + '". Press enter to create a new pattern_match.';
    },

    getNoDataPhrase: function() {
        return "No patterns exist";
    },

    getAllResultsAddedPhrase: function() {
        return "All patterns have been added";
    },

    getAllAddedMatchingQueryPhrase: function(query) {
        return 'All patterns matching "' + query + '" have been added'
    },

    renderModel: function(pattern_match) {
        return (
        <ChosenDropdownItem key={pattern_match.id}
            item={pattern_match}
            propertyCB={this.props.propertyCB}
            propertyName={this.props.propertyName}
            onItemSelected={this.onModelAdded} />
        )
    },

    renderSelectedModel: function(pattern_match) {
        return (
        <ChosenSelectedItem key={pattern_match.id}
            item={pattern_match}
            propertyCB={this.props.propertyCB}
            propertyName={this.props.propertyName}
            onRemoveItem={this.props.onModelRemoved} />
        )
    },
    render: function() {
        var createShowing = this.state.showCreateForm,
            createButtonText = this.props.createButtonText,
            showFormButtonText = (!createShowing) ? this.props.showButtonText : this.props.hideButtonText;

        return (
        <div className="pattern_match-multi-select-and-create">
            <h4 className="t-body-2">{this.props.titleText}</h4>
            <div className="help-block">
                To grant access to future usernames and emails, you can add patterns to the image.
                Any user who matches the pattern_matches below will be granted access to launch instances.
                This will affect previous and future versions of the image.
                To see a list of all users who have access to a specific version:
                Select 'Edit Version' below and refer to 'Version Shared With'
            </div>
            <div className="form-group">
                {this.renderChosenSearchSelect()}
            </div>
            <div className="form-group clearfix">
                <button onClick={this.onEditChange} type="button" className="btn btn-default btn-sm pull-right">
                    {showFormButtonText}
                </button>
            </div>
            {this.renderCreateForm(createButtonText)}
        </div>
        );
    }
});
