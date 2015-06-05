define(function (require) {

  var React = require('react'),
      Backbone = require('backbone');
      //ChosenDropdownItem = require('./ChosenDropdownItem.react'),
      //ChosenSelectedTag = require('./ChosenSelectedTag.react');

  return {

    getInitialState: function(){
      return {
        showOptions: false,
        query: ""
      }
    },

    propTypes: {
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onModelAdded: React.PropTypes.func.isRequired,
      onModelRemoved: React.PropTypes.func.isRequired,
      onEnterKeyPressed: React.PropTypes.func.isRequired,
      width: React.PropTypes.string
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

    filterSearchResults: function() {
      var node = this.getDOMNode();
      var $node = $(node);
      var search_field = $node.find('input');
      var query = search_field.val();
      this.setState({query: query});
      this.props.onQueryChange(query);
    },

    onModelAdded: function(model){
      //this.setState({query: ""});
      this.props.onModelAdded(model);
      this.clearSearchField();
    },

    clearSearchField: function(){
      var input = this.refs.searchField.getDOMNode();
      input.value = "";
      input.focus();
      this.setState({query: ""});
    },

    //
    // Result render helpers
    //

    renderLoadingListItem: function(query){
      return (
        <li className="no-results">
          <span>Searching for "{query}"...</span>
        </li>
      )
    },

    renderNoResultsForQueryListItem: function(query){
      return (
        <li className="no-results">
          No users found with username "<span>{query}</span>"
        </li>
      )
    },

    renderAlreadyAddedAllUsersMatchingQueryListItem: function(query){
      return (
        <li className="no-results">
          All users matching "<span>{query}</span>" have been added.
        </li>
      )
    },

    renderNoDataListItem: function(){
      return (
        <li className="no-results">
          No users exist.
        </li>
      );
    },

    renderAllAddedListItem: function(){
      return (
        <li className="no-results">
          All available users have been added.
        </li>
      );
    },

    //
    // Render
    //

    render: function () {
      var tags = this.props.tags,
          activeTags = this.props.activeTags,
          query = this.state.query,
          selectedTags = activeTags.map(this.renderSelectedTag),
          placeholderText = selectedTags.length > 0 ? "" : "Select users to add...",
          filteredTags,
          tags,
          classes = React.addons.classSet({
            'chosen-container-external': true,
            'chosen-container-external-multi': true,
            'chosen-with-drop': this.state.showOptions && query,
            'chosen-container-external-active': this.state.showOptions
          });

      if(!tags){
        tags = this.renderLoadingListItem(query);
      }else if(query && tags.length < 1){
        tags = this.renderNoResultsForQueryListItem(query);
      }else if(selectedTags.length === 0 && tags.length < 1){
        tags = this.renderNoDataListItem();
      }else if(selectedTags.length > 0 && tags.length < 1){
        tags = this.renderAllAddedListItem();
      }else{
        // filter out results that have already been added
        filteredTags = tags.filter(function(tag){
          return activeTags.filter(function(activeTag){
            return tag.id === activeTag.id;
          }).length === 0;
        });
        if(tags.length > 0 && filteredTags.length === 0){
          tags = this.renderAlreadyAddedAllUsersMatchingQueryListItem(query);
        }else{
          tags = filteredTags.map(this.renderTag);
        }
      }

      return (
        <div className={classes} style={{"width": this.props.width || "614px"}}>
          <ul className="chosen-choices clearfix" onFocus={this.onEnterOptions}>
            {selectedTags}
          </ul>
          <input
            type="text"
            ref="searchField"
            className="form-control"
            placeholder="Search by username..."
            autoComplete="off"
            onKeyUp={this.filterSearchResults}
            onFocus={this.onEnterOptions}
          />
          <div className="chosen-drop">
            <ul className="chosen-results">
              {tags}
            </ul>
          </div>
        </div>
      );
    }

  };

});
