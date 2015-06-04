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

    componentDidMount: function(){
      //this.setupChosenForm();
    },

    setupChosenForm: function(){
      var el = this.getDOMNode(),
          $el = $(el);

      $el.find('.search-field input')
         .keyup(this.props.onEnterKeyPressed);
    },

    // check
    onTagSelected: function(selectedTag){
      this.closeDropdown();
      this.props.onModelAdded(selectedTag);
    },

    // check
    onRemoveTag: function(tagToRemove){
      this.props.onModelRemoved(tagToRemove);
    },

    // check
    //renderTag: function(tag){
    //  return (
    //    <ChosenDropdownItem key={tag.id} tag={tag} onTagSelected={this.onTagSelected}/>
    //  )
    //},
    //
    //// check
    //renderSelectedTag: function(tag){
    //  return (
    //    <ChosenSelectedTag key={tag.id} tag={tag} onRemoveTag={this.onRemoveTag}/>
    //  )
    //},

    closeDropdown: function(){
      this.setState({showOptions: false});
    },

    _getContainer: function(){
      var $node = $(this.getDOMNode()),
          container = $node.find('.chosen-container');

      return container;
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

    onKeyUp: function(){
      this.filterSearchResults();
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
      var cx = React.addons.classSet,
          tags = this.props.tags,
          activeTags = this.props.activeTags,
          //query = this.props.query,
          query = this.state.query,
          classes = cx({
            'chosen-container-external': true,
            'chosen-container-external-multi': true,
            'chosen-with-drop': !!query, //this.state.showOptions,
            'chosen-container-external-active': !!query //this.state.showOptions
          }),

          selectedTags = activeTags.map(this.renderSelectedTag),
          placeholderText = selectedTags.length > 0 ? "" : "Select users to add...",
          filteredTags,
          tags;

      if(!tags){
        tags = this.renderLoadingListItem(query);
      }else if(query && tags.length < 1){
        tags = this.renderNoResultsForQueryListItem(query);
      }else if(selectedTags.length === 0 && tags.length < 1){
        tags = this.renderNoDataListItem();
      }else if(selectedTags.length > 0 && tags.length < 1){
        tags = this.renderAllAddedListItem();
      }else{
        //filteredTags = tags.difference(activeTags);
        filteredTags = tags.filter(function(tag){
          return activeTags.filter(function(activeTag){
            return tag.id === activeTag.id;
          }).length === 0;
        });
        if(tags.length > 0 && filteredTags.length === 0){
          tags = this.renderAlreadyAddedAllUsersMatchingQueryListItem(query);
        }else{
          //filteredTags = filteredTags.filter(function(tag){
          //  return tag.get('username').indexOf(query) > -1;
          //}.bind(this));
          tags = filteredTags.map(this.renderTag);
        }
      }

      return (
        <div className={classes} style={{"width": this.props.width || "614px"}}>
          <ul className="chosen-choices clearfix" onFocus={this.onEnterOptions}>
            {selectedTags}
            {
              //<li className="search-choice">
              //  <span>jchansen</span>
              //  <a className="search-choice-close"></a>
              //</li>
              //<li className="search-choice">
              //  <span>dahanr</span>
              //  <a className="search-choice-close"></a>
              //</li>
            }
          </ul>
          <input
            type="text"
            ref="searchField"
            className="form-control"
            placeholder="Search by username..."
            autoComplete="off"
            onKeyUp={this.onKeyUp}
          />
          {
            <div className="chosen-drop">
              <ul className="chosen-results">
                {tags}
              </ul>
            </div>
          }
        </div>
      );

      return (
        <div className={classes} style={{"width": this.props.width || "614px"}}>
          <ul className="chosen-choices" onFocus={this.onEnterOptions}>
            {selectedTags}
            {
              //<li className="search-field">
              //  <input
              //    ref="searchField"
              //    //value={query}
              //    type="text"
              //    placeholder={placeholderText}
              //    className="default"
              //    autoComplete="off"
              //    onKeyUp={this.onKeyUp}
              //  />
              //</li>
            }
          </ul>
          {
            //<div className="chosen-drop">
            //  <ul className="chosen-results">
            //    {tags}
            //  </ul>
            //</div>
          }
        </div>
      );
    }

  };

});
