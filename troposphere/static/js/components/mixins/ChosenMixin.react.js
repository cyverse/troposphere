define(function (require) {

  var React = require('react'),
      Backbone = require('backbone');
      //ChosenDropdownItem = require('./ChosenDropdownItem.react'),
      //ChosenSelectedTag = require('./ChosenSelectedTag.react');

  return {

    getInitialState: function(){
      return {
        showOptions: false,
        searchText: ""
      }
    },

    propTypes: {
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onTagAdded: React.PropTypes.func.isRequired,
      onTagRemoved: React.PropTypes.func.isRequired,
      onEnterKeyPressed: React.PropTypes.func.isRequired,
      width: React.PropTypes.string
    },

    componentDidMount: function(){
      this.scaleSearchField();
      this.setupChosenForm();
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
      this.props.onTagAdded(selectedTag);
    },

    // check
    onRemoveTag: function(tagToRemove){
      this.props.onTagRemoved(tagToRemove);
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

    scaleSearchField: function() {
      var div, f_width, h, style, style_block, styles, w, _i, _len;

      var node = this.getDOMNode();
      var $node = $(node);
      var search_field = $node.find('input');

      var container = $node.find(".chosen-choices");

      h = 0;
      w = 0;
      style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
      styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
      for (_i = 0, _len = styles.length; _i < _len; _i++) {
        style = styles[_i];
        style_block += style + ":" + search_field.css(style) + ";";
      }
      div = $('<div />', {
        'style': style_block
      });
      div.text(search_field.val());
      $('body').append(div);
      w = div.width() + 25;
      div.remove();
      f_width = container.outerWidth();
      if (w > f_width - 10) {
        w = f_width - 10;
      }

      // set the width of the input
      if(w < 150) w = 150;

      search_field.css({
        'width': w + 'px'
      });

    },

    filterSearchResults: function() {
      var node = this.getDOMNode();
      var $node = $(node);
      var search_field = $node.find('input');
      var searchText = search_field.val();
      this.setState({searchText: searchText});
    },

    onKeyUp: function(){
      this.scaleSearchField();
      this.filterSearchResults();
    },

    //
    // Result render helpers
    //

    renderNoResultsForQueryListItem: function(query){
      return (
        <li className="no-results">
          No users found with username "<span>{query}</span>"
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
          classes = cx({
            'chosen-container': true,
            'chosen-container-multi': true,
            'chosen-with-drop': this.state.showOptions,
            'chosen-container-active': this.state.showOptions
          }),
          selectedTags = this.props.activeTags.map(this.renderSelectedTag),
          filteredTags = this.props.tags.difference(this.props.activeTags.models),
          tags,
          placeholderText = "";

      filteredTags = filteredTags.filter(function(tag){
        return tag.get('username').indexOf(this.state.searchText) > -1;
      }.bind(this));

      tags = filteredTags.map(this.renderTag);

      if(this.state.searchText && tags.length < 1){
        tags = this.renderNoResultsForQueryListItem();
      }else if(selectedTags.length === 0 && tags.length < 1){
        tags = this.renderNoDataListItem();
      }else if(selectedTags.length > 0 && tags.length < 1){
        tags = this.renderAllAddedListItem();
      }

      placeholderText = selectedTags.length > 0 ? "" : "Select users to add...";

      return (
        <div className={classes} style={{"width": this.props.width || "614px"}}>
          <ul className="chosen-choices" onFocus={this.onEnterOptions}>
            {selectedTags}
            <li className="search-field">
              <input type="text" placeholder={placeholderText} className="default" autoComplete="off" onKeyUp={this.onKeyUp}/>
            </li>
          </ul>
          <div className="chosen-drop">
            <ul className="chosen-results">
              {tags}
            </ul>
          </div>
        </div>
      );
    }

    //render: function () {
    //  var cx = React.addons.classSet,
    //      classes = cx({
    //        'chosen-container': true,
    //        'chosen-container-multi': true,
    //        'chosen-with-drop': this.state.showOptions,
    //        'chosen-container-active': this.state.showOptions
    //      }),
    //      selectedTags = this.props.activeTags.map(this.renderSelectedTag),
    //      filteredTags = this.props.tags.difference(this.props.activeTags.models),
    //      tags,
    //      placeholderText = "";
    //
    //  filteredTags = filteredTags.filter(function(tag){
    //    return tag.get('name').indexOf(this.state.searchText) > -1;
    //  }.bind(this));
    //
    //  tags = filteredTags.map(this.renderTag);
    //
    //  if(this.state.searchText && tags.length < 1){
    //    tags = (
    //      <li className="no-results">
    //        No tag found. Press Enter to create a new tag for "<span>{this.state.searchText}</span>"
    //      </li>
    //    )
    //  }else if(selectedTags.length === 0 && tags.length < 1){
    //    tags = (
    //      <li className="no-results">
    //        No tags have been created yet.
    //      </li>
    //    )
    //  }else if(selectedTags.length > 0 && tags.length < 1){
    //    tags = (
    //      <li className="no-results">
    //        All available tags have been added.
    //      </li>
    //    )
    //  }
    //
    //  placeholderText = selectedTags.length > 0 ? "" : "Select tags to add...";
    //
    //  return (
    //    <div className={classes} style={{"width": this.props.width || "614px"}}>
    //      <ul className="chosen-choices" onFocus={this.onEnterOptions}>
    //        {selectedTags}
    //        <li className="search-field">
    //          <input type="text" placeholder={placeholderText} className="default" autoComplete="off" onKeyUp={this.onKeyUp}/>
    //        </li>
    //      </ul>
    //      <div className="chosen-drop">
    //        <ul className="chosen-results">
    //          {tags}
    //        </ul>
    //      </div>
    //    </div>
    //  );
    //}

  };

});
