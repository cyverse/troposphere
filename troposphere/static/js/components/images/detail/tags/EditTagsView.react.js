define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    EditTagsView = require('./ActualEditTagsView.react'),
    modals = require('modals'),
    actions = require('actions'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onTagAdded: React.PropTypes.func.isRequired,
      onTagRemoved: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
      return {
        tags: this.props.image.get('tags')
      }
    },

    onCreateNewTag: function (tagNameSuggestion) {
      modals.TagModals.create(tagNameSuggestion);
    },

    render: function () {
      var image = this.props.image;
      var image = new this.props.image.constructor({
        id: image.id,
        tags: this.props.value
      });
      var imageTags = stores.TagStore.getImageTags(image);

      return (
        <div className="image-tags image-info-segment row">
          <h4 className="title col-md-2">Tags</h4>

          <div className="content col-md-10">
            <EditTagsView
              tags={this.props.tags}
              activeTags={imageTags}
              onTagAdded={this.props.onTagAdded}
              onTagRemoved={this.props.onTagRemoved}
              onCreateNewTag={this.onCreateNewTag}
              />
          </div>
        </div>
      );
    }

  });

});
