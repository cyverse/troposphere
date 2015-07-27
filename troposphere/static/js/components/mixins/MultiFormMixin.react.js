define(function (require) {

  var React = require('react'),
      Backbone = require('backbone');

  var ENTER_KEY = 13;

  return {
    getInitialState: function(){
      return {
        showCreateForm: true,
        showOptions: false,
        query: ""
      }
    },

    propTypes: {
      placeholderText: React.PropTypes.string,
      titleText: React.PropTypes.string,
      models: React.PropTypes.instanceOf(Backbone.Collection),
      activeModels: React.PropTypes.instanceOf(Backbone.Collection),
      onModelAdded: React.PropTypes.func.isRequired,
      onModelRemoved: React.PropTypes.func.isRequired,
      renderCreateForm: React.PropTypes.func,
    },

    getDefaultProps: function(){
      return {
        models: new Backbone.Collection(),
        activeModels: new Backbone.Collection(),
        titleText: "Title",
        placeholderText: "Search..."
      }
    },

    closeDropdown: function(){
      this.setState({showOptions: false});
    },

    onEnterOptions: function(e){
      this.setState({showOptions: true});

      $(document).bind("mouseup", this._checkIfApplies);
    },

    _checkIfApplies: function(e){
      if(this.isOutsideClick(e)){
        this.onLeaveOptions();
        $(document).unbind("mouseup", this._checkIfApplies);
      }
    },

    onLeaveOptions: function(e){
      this.closeDropdown();
    },

    isOutsideClick: function(e){
      var node = this.getDOMNode();
      var $node = $(node);
      var container = $node;//.find('.chosen-container');

      if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
        return true;
      }
      return false;
    },

    onEnter: function(e){
      if(e.which !== ENTER_KEY) return;
      if(this.props.onEnterKeyPressed) this.props.onEnterKeyPressed(e);
      this.clearSearchField();
    },

    filterSearchResults: function() {
      var node = this.getDOMNode();
      var $node = $(node);
      var search_field = $node.find('input');
      var query = search_field.val();
      this.setState({query: query});
      this.props.onQueryChange(query);
    },
    onShowCreateForm: function(e) {
      if(this.state.showCreate == false) {
        this.setState({showCreate: true})
      } else {
        this.setState({showCreate: false})
      }
    },
    onModelAdded: function(model){
      this.props.onModelAdded(model);
      this.clearSearchField();
    },

    clearSearchField: function(){
      var query = "",
          input = this.refs.searchField.getDOMNode();
      input.value = query;
      input.focus();
      this.setState({query: query});
      this.props.onQueryChange(query);
    },

    //
    // Result render helpers
    //

    renderLoadingListItem: function(query){
      return (
        <li className="no-results">Searching for "{query}"...</li>
      )
    },

    renderNoResultsForQueryListItem: function(query){
      var phrase = 'No results found matching "' + query + '"';
      if(this.getNoResultsPhrase) phrase = this.getNoResultsPhrase(query);
      return <li className="no-results">{phrase}</li>;
    },

    renderAlreadyAddedAllUsersMatchingQueryListItem: function(query){
      var phrase = 'All results matching "' + query + '" have been added';
      if(this.getAllAddedMatchingQueryPhrase) phrase = this.getAllAddedMatchingQueryPhrase(query);
      return <li className="no-results">{phrase}</li>;
    },

    renderNoDataListItem: function(){
      var phrase = 'No results exist';
      if(this.getNoDataPhrase) phrase = this.getNoDataPhrase();
      return <li className="no-results">{phrase}</li>;
    },

    renderAllAddedListItem: function(){
      var phrase = 'All results have been added';
      if(this.getAllResultsAddedPhrase) phrase = this.getAllResultsAddedPhrase();
      return <li className="no-results">{phrase}</li>;
    },
    renderCreateForm: function() {
      if(!this.props.renderCreateForm) {
        return (<div className="new-item-form">
          {"You should renderCreateForm"}
        </div>);
      } else if (this.state.showCreateForm == false) {
        return;
      } else {
        return (<div className="new-item-form">
          {this.props.renderCreateForm()}
        </div>);
      }
    },
    //
    // Render
    //

    render: function () {
      var models = this.props.models,
          activeModels = this.props.activeModels,
          query = this.state.query,
          createShowing = this.state.showCreateForm,
          showCreateText = (createShowing == false) ? "Create New License" : "Hide License Form",
          selectedModels = activeModels.map(this.renderSelectedModel),
          placeholderText = this.props.placeholderText,
          filteredModels,
          classes = React.addons.classSet({
            'chosen-container-external': true,
            'chosen-container-external-multi': true,
            'chosen-with-drop': this.state.showOptions && query,
            'chosen-container-external-active': this.state.showOptions
          }),
          results;

      if(!models){
        results = this.renderLoadingListItem(query);
      }else if(query && models.length < 1){
        results = this.renderNoResultsForQueryListItem(query);
      }else if(selectedModels.length === 0 && models.length < 1){
        results = this.renderNoDataListItem();
      }else if(selectedModels.length > 0 && models.length < 1){
        results = this.renderAllAddedListItem();
      }else{
        // filter out results that have already been added
        filteredModels = models.filter(function(model){
          return activeModels.filter(function(activeModel){
            return model.id === activeModel.id;
          }).length === 0;
        });
        if(models.length > 0 && filteredModels.length === 0){
          results = this.renderAlreadyAddedAllUsersMatchingQueryListItem(query);
        }else {
          results = filteredModels.map(this.renderModel);
        }
      }

      return (
        <div className={classes} style={{"width": this.props.width || "614px"}}>
          <h3>{this.props.titleText}</h3>
          <button onClick={this.onShowCreateForm} type="button" className="btn btn-default btn-sm">{showCreateText}</button>
          <ul className="chosen-choices clearfix" onFocus={this.onEnterOptions}>
            {selectedModels}
          </ul>
          <input
            type="text"
            ref="searchField"
            className="form-control"
            placeholder={placeholderText}
            autoComplete="off"
            onKeyDown={this.onEnter}
            onKeyUp={this.filterSearchResults}
            onFocus={this.onEnterOptions}
          />
          <div className="chosen-drop">
            <ul className="chosen-results">
              {results}
            </ul>
          </div>
          {this.renderCreateForm}
        </div>
      );
    }

  };

});
