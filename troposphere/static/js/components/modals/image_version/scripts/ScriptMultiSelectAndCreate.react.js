define(function (require) {
  var ENTER_KEY = 13;

  var React = require('react'),
      Backbone = require('backbone'),
      _ = require('underscore'),
      ChosenDropdownItem = require('components/common/chosen/ChosenDropdownItem.react'),
      ChosenSelectedItem = require('components/common/chosen/ChosenSelectedItem.react'),
      ChosenMixinExternal = require('components/mixins/ChosenMixinExternal.react'),
      CreateScriptView = require('./CreateScriptView.react');

  return React.createClass({
    displayName: "ScriptMultiSelectAndCreate",

    mixins: [ChosenMixinExternal],

    propTypes: {
      //Mixin-requires:
      models: React.PropTypes.instanceOf(Backbone.Collection),
      activeModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      requiredModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      propertyName: React.PropTypes.string.isRequired,
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

    getInitialState: function(){
      return {
        showCreateForm: this.props.showCreateForm,
        scriptTitle: "",
      }
    },

    getDefaultProps: function(){
      return {
        titleText: "Deployment Scripts",
        createButtonText: "Add to Scripts",
        showButtonText: "Create New Script",
        hideButtonText: "Cancel",
        showCreateForm: false,
      }
    },
    onEnterKeyPressed: function(value){
      if(this.state.showOptions) {
        //IF options are showing and results are listed, pick the first one on Enter-pressed.
        var filtered_results = this.getFilteredResults(
          this.props.models,
          this.props.activeModels)
        if (filtered_results && filtered_results.length > 0) {
          this.onModelAdded(filtered_results[0])
        } else {
          this.setState({
            showCreateForm: true,
            scriptTitle: value
          });
          if(this.props.onEnterKeyPressed) {
            this.props.onEnterKeyPressed(value);
            this.clearSearchField();
          }

        }
      }

    },
    renderCreateForm: function(createButtonText) {
      if (this.state.showCreateForm == false) {
        return (<div className="new-script-form new-item-form"
                     style={{"visibility": "hidden"}}/>);
      } else {
        return (<CreateScriptView
          onCreateScript={this.onCreateScript}
          scriptTitle={this.state.scriptTitle}
          />);
      }
    },
    onEditChange: function(e) {
      var truth_value = (this.state.showCreateForm) ? false : true;
      this.setState({showCreateForm: truth_value});
    },
    isSubmittable: function() {
      return this.props.isSubmittable(this.state);
    },
    onCreateScript: function(model) {
      this.props.onModelCreated(model);
      this.setState({showCreateForm: false});
    },

    getNoResultsPhrase: function(query){
      return 'No scripts found matching "' + query + '". Press enter to create a new script.';
    },

    getNoDataPhrase: function(){
      return "No scripts exist";
    },

    getAllResultsAddedPhrase: function(){
      return "All scripts have been added";
    },

    getAllAddedMatchingQueryPhrase: function(query){
      return 'All scripts matching "' + query + '" have been added'
    },

    renderModel: function(script){
      return (
        <ChosenDropdownItem
          key={script.id}
          item={script}
          propertyName={this.props.propertyName}
          onItemSelected={this.onModelAdded}
        />
      )
    },

    renderSelectedModel: function(script){
      return (
        <ChosenSelectedItem
          key={script.id}
          item={script}
          propertyName={this.props.propertyName}
          onRemoveItem={this.props.onModelRemoved}
        />
      )
    },
    render: function () {
      var createShowing = this.state.showCreateForm,
        createButtonText = this.props.createButtonText,
        showFormButtonText = (!createShowing) ? this.props.showButtonText : this.props.hideButtonText;

      return (
        <div className="scriptMultiSelectAndCreate">
          <h4>{this.props.titleText}</h4>
          <div className="help-block">
            Deployment scripts will be executed when a user has launched their instance.
            They will also be executed each time an instance is "Started", "Resumed", or "Restarted".
            As such, these scripts should be able to handle being run multiple times without adverse effects.
          </div>
          {this.renderChosenSearchSelect()}
          <div className="form-group clearfix">
            <button onClick={this.onEditChange} type="button"
                    className="btn btn-default btn-sm pull-right">
                    {showFormButtonText}
            </button>
          </div>
          {this.renderCreateForm(createButtonText)}
        </div>
      );
    }


  })

});
