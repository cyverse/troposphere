define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    EditTagsView = require('components/common/tags/EditTagsView.react');

  return React.createClass({
    displayName: "ResourceTags",

    propTypes: {
      tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      onTagAdded: React.PropTypes.func.isRequired,
      onTagRemoved: React.PropTypes.func.isRequired,
      onCreateNewTag: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
      return {
        isEditingTags: false
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

    render: function () {
      return (
        <div>
          <EditTagsView
            activeTags={this.props.activeTags}
            tags={this.props.tags}
            onTagAdded={this.props.onTagAdded}
            onTagRemoved={this.props.onTagRemoved}
            onCreateNewTag={this.props.onCreateNewTag}
            label={"Instance Tags:"}
            />
        </div>
      );
    }

  });

});
