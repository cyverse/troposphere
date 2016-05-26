import React from 'react';
import Backbone from 'backbone';
import ViewTags from './ViewTags.react';
import TagMultiSelect from './TagMultiSelect.react';


let ENTER_KEY = 13;

export default React.createClass({
    displayName: "CommonEditTagsView",

    propTypes: {
      activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onTagAdded: React.PropTypes.func.isRequired,
      onTagRemoved: React.PropTypes.func.isRequired,
      onCreateNewTag: React.PropTypes.func.isRequired,
      label: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
      return {
        isEditingTags: false,
        query: ""
      }
    },

    onEditTags: function (e) {
      e.preventDefault();
      this.setState({isEditingTags: true});
    },

    onDoneEditingTags: function (e) {
      e.preventDefault();
      this.setState({isEditingTags: false});
    },

    onEnterKeyPressed: function (e) {
      var text = e.target.value;
      if (e.which === ENTER_KEY && text.trim()) {
        this.props.onCreateNewTag(text);
      }
    },

    onCreateNewEmptyTag: function (e) {
      this.props.onCreateNewTag("");
    },

    onQueryChange: function (query) {
      this.setState({query: query.toLowerCase()});
    },

    render: function () {
      var query = this.state.query,
        link,
        newTagButton,
        tagView,
        tags = this.props.tags;

      if (query) {
        tags = this.props.tags.filter(function (tag) {
          return tag.get('name').toLowerCase().indexOf(query) >= 0;
        });
        tags = new Backbone.Collection(tags);
      }

      if (this.state.isEditingTags) {
        link = (
          <a className="toggle-editing-link" href="#" onClick={this.onDoneEditingTags}>Done editing</a>
        );

        newTagButton = (
          <a className="btn btn-primary new-tag" href="#" onClick={this.onCreateNewEmptyTag}>+ New tag</a>
        );
      } else {
        link = (
          <a className="toggle-editing-link" href="#" onClick={this.onEditTags}>Create/Edit tags</a>
        );
      }

      if (this.state.isEditingTags) {
        tagView = (
          <TagMultiSelect
            models={tags}
            activeModels={this.props.activeTags}
            onModelAdded={this.props.onTagAdded}
            onModelRemoved={this.props.onTagRemoved}
            onModelCreated={this.props.onTagCreated}
            onEnterKeyPressed={this.onEnterKeyPressed}
            onCreateNewTag={this.props.onCreateNewTag}
            onQueryChange={this.onQueryChange}
            placeholderText="Search by tag name..."
            />
        )
      } else {
        tagView = (
          <ViewTags activeTags={this.props.activeTags}/>
        );
      }

      return (
        <div className="resource-tags">
          <span className='tag-title'>{this.props.label}</span>
          {link}
          {newTagButton}
          {tagView}
        </div>
      );
    }
});
