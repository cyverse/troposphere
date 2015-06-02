define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      ChosenDropdownItem = require('./ChosenDropdownItem.react'),
      ChosenSelectedTag = require('./ChosenSelectedTag.react'),
      ChosenMixin = require('components/mixins/ChosenMixin.react');

  return React.createClass({
    mixins: [ChosenMixin],

    propTypes: {
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onTagAdded: React.PropTypes.func.isRequired,
      onTagRemoved: React.PropTypes.func.isRequired
    },

    //render: function(){
    //  return (
    //    <div>Chosen Users Dropdown</div>
    //  )
    //}

    onAddUser: function(tag){
      console.log(tag);
    },

    onRemoveUser: function(tag){
      console.log(tag);
    },

    renderTag: function(tag){
      return (
        <ChosenDropdownItem
          key={tag.id}
          tag={tag}
          propertyName={'username'}
          onTagSelected={this.props.onTagAdded}
        />
      )
    },

    renderSelectedTag: function(tag){
      return (
        <ChosenSelectedTag
          key={tag.id}
          tag={tag}
          propertyName={'username'}
          onRemoveTag={this.props.onTagRemoved}
        />
      )
    },

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
        tags = (
          <li className="no-results">
            No users found with username "<span>{this.state.searchText}</span>"
          </li>
        )
      }else if(selectedTags.length === 0 && tags.length < 1){
        tags = (
          <li className="no-results">
            No users exist.
          </li>
        )
      }else if(selectedTags.length > 0 && tags.length < 1){
        tags = (
          <li className="no-results">
            All available users have been added.
          </li>
        )
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
  })

});
