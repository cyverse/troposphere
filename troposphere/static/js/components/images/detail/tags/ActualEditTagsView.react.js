import React from 'react';
import Backbone from 'backbone';
import TagMultiSelect from 'components/common/tags/TagMultiSelect.react';

let ENTER_KEY = 13;

export default React.createClass({
    displayName: "ActualEditTagsView",

    propTypes: {
      activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onTagAdded: React.PropTypes.func.isRequired,
      onTagRemoved: React.PropTypes.func.isRequired,
      onCreateNewTag: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
      return {
        query: ""
      };
    },

    onEnterKeyPressed: function (e) {
      e.preventDefault();
      var text = e.target.value;
      if (e.which === ENTER_KEY && text.trim()) {
        this.props.onCreateNewTag(text);
      }
    },

    onCreateNewEmptyTag: function (e) {
      e.preventDefault();
      this.props.onCreateNewTag("");
    },

    onQueryChange: function (query) {
      this.setState({query: query});
    },

    render: function () {
      var query = this.state.query,
        tags;

      if (query) {
        tags = this.props.tags.filter(function (tag) {
          return tag.get('name').toLowerCase().indexOf(query.toLowerCase()) >= 0;
        });
        tags = new Backbone.Collection(tags);
      }

      return (
        <div className="resource-tags">
          <a className="btn btn-primary new-tag" href="#" onClick={this.onCreateNewEmptyTag}>+ New tag</a>
          <TagMultiSelect
            models={tags}
            activeModels={this.props.activeTags}
            onModelAdded={this.props.onTagAdded}
            onModelRemoved={this.props.onTagRemoved}
            onCreateNewTag={this.props.onCreateNewTag}
            onEnterKeyPressed={this.onEnterKeyPressed}
            onQueryChange={this.onQueryChange}
            placeholderText="Search by tag name..."
            />
        </div>
      );
    }
});
