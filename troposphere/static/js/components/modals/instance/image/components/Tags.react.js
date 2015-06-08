define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores'),
      TagMultiSelect = require('components/common/tags/TagMultiSelect.react');

  return React.createClass({

    propTypes: {
      onTagAdded: React.PropTypes.func.isRequired,
      onTagRemoved: React.PropTypes.func.isRequired,
      imageTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    onQueryChange: function(query){
      this.setState({query: query});
    },

    render: function () {
      var imageTags = this.props.imageTags,
          tags = stores.TagStore.getAll();

      if(!tags) return <div className="loading"/>;

      return (
        <div className="form-group">
          <label htmlFor="tags" className="control-label">Image Tags</label>
          <div className="tagger_container">
            <div className="help-block">
              Please include tags that will help users decide whether this image will suit their
              needs. You can include the operating system, installed software, or configuration information. E.g. Ubuntu,
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
              onQueryChange={this.onQueryChange}
              width={"100%"}
              placeholderText="Search by tag name..."
            />
          </div>
        </div>
      );
    }

  });

});
