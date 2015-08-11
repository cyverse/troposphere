define(function (require) {
  var ENTER_KEY = 13;

  var React = require('react/addons'),
      Backbone = require('backbone'),
      ChosenDropdownItem = require('components/common/chosen/ChosenDropdownItem.react'),
      ChosenSelectedItem = require('components/common/chosen/ChosenSelectedItem.react'),
      ChosenMixinExternal = require('components/mixins/ChosenMixinExternal.react'),
      CreateLicenseView = require('./CreateLicenseView.react');

  return React.createClass({
    displayName: "LicenseMultiSelectAndCreate",

    mixins: [ChosenMixinExternal],

    propTypes: {
      //Mixin-requires:
      models: React.PropTypes.instanceOf(Backbone.Collection),
      activeModels: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
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
        licenseTitle: "",
      }
    },

    getDefaultProps: function(){
      return {
        titleText: "Software Licenses",
        createButtonText: "Add to Licenses",
        showButtonText: "Create New License",
        hideButtonText: "Cancel",
        showCreateForm: false,
        width: "550px",
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
            licenseTitle: value
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
        return (<div className="new-license-form new-item-form"
                     style={{"visibility": "hidden"}}/>);
      } else {
        return (<CreateLicenseView
          onCreateLicense={this.onCreateLicense}
          licenseTitle={this.state.licenseTitle}
          />);
      }
    },
    getFilteredResults: function(models, activeModels) {

      var filteredResults = models.filter(function(model){
        return activeModels.filter(function(activeModel){
            return model.id === activeModel.id;
          }).length === 0;
      });
      return filteredResults;
    },
    onEditChange: function(e) {
      var truth_value = (this.state.showCreateForm) ? false : true;
      this.setState({showCreateForm: truth_value});
    },
    isSubmittable: function() {
      return this.props.isSubmittable(this.state);
    },
    onCreateLicense: function(model) {
      this.props.onModelCreated(model);
      this.setState({showCreateForm: false});
    },

    getNoResultsPhrase: function(query){
      return 'No licenses found matching "' + query + '". Press enter to create a new license.';
    },

    getNoDataPhrase: function(){
      return "No licenses exist";
    },

    getAllResultsAddedPhrase: function(){
      return "All licenses have been added";
    },

    getAllAddedMatchingQueryPhrase: function(query){
      return 'All licenses matching "' + query + '" have been added'
    },

    renderModel: function(license){
      return (
        <ChosenDropdownItem
          key={license.id}
          item={license}
          propertyName={this.props.propertyName}
          onItemSelected={this.onModelAdded}
        />
      )
    },

    renderSelectedModel: function(license){
      return (
        <ChosenSelectedItem
          key={license.id}
          item={license}
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
        <div className="license-multi-select-and-create">
          <h4>{this.props.titleText}</h4>
          <div className="help-block">
            All licensed software should be documented here. Any user who wishes to use an image with
            license restrictions will be required to view and agree the license prior to launching.
          </div>
          <div className="form-group">
            {this.renderChosenSearchSelect()}
          </div>
          <div className="form-group clearfix">
            <button onClick={this.onEditChange} type="button" className="btn btn-default btn-sm pull-right">{showFormButtonText}</button>
          </div>
          {this.renderCreateForm(createButtonText)}
        </div>
      );
    }


  })

});
