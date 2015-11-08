import React from 'react/addons';
import Backbone from 'backbone';
import stores from 'stores';
import TagMultiSelect from 'components/common/tags/TagMultiSelect.react';

export default React.createClass({
    displayName: "Tags",

    propTypes: {
      onTagAdded: React.PropTypes.func.isRequired,
      onTagRemoved: React.PropTypes.func.isRequired,
      onTagCreated: React.PropTypes.func.isRequired,
      imageTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    getInitialState: function () {
      return {
        query: ""
      }
    },

    onQueryChange: function (query) {
      this.setState({query: query});
    },

    render: function () {
      var imageTags = this.props.imageTags,
        tags = stores.TagStore.getAll(),
        query = this.state.query;

      if (!tags) return <div className="loading"/>;

      if (query) {
        tags = tags.filter(function (tag) {
          return tag.get('name').toLowerCase().indexOf(query) >= 0;
        });
        tags = new Backbone.Collection(tags);
      }

      return (
        <div className="form-group">
          <label htmlFor="tags" className="control-label">Image Tags</label>

          <div className="tagger_container">
            <div className="help-block">
              Please include tags that will help users decide whether this image will suit their
              needs. You can include the operating system, installed software, or configuration information. E.g.
              Ubuntu,
              NGS Viewers, MAKER, QIIME, etc.
            </div>
            <div className="help-block">
              For your convenience, we've automatically added the tags that were already on the instance.
            </div>
            <TagMultiSelect
              models={tags}
              activeModels={imageTags}
              onModelAdded={this.props.onTagAdded}
              onModelRemoved={this.props.onTagRemoved}
              onModelCreated={this.props.onTagCreated}
              onQueryChange={this.onQueryChange}
              width={"100%"}
              placeholderText="Search by tag name..."
              />
          </div>
        </div>
      );
    }
});
