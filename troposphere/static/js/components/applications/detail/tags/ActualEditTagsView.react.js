/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/tags/EditTags.react'
  ],
  function (React, Backbone, EditTags) {

    var ENTER_KEY = 13;

    return React.createClass({
      display: "ActualEditTagsView",

      propTypes: {
        activeTags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onTagsChanged: React.PropTypes.func.isRequired,
        onCreateNewTag: React.PropTypes.func.isRequired
      },

      onEnterKeyPressed: function(e){
        e.preventDefault();
        var text = e.target.value;
        if (e.which === ENTER_KEY && text.trim()) {
          this.props.onCreateNewTag(text);
        }
      },

      onCreateNewEmptyTag: function(e){
        e.preventDefault();
        this.props.onCreateNewTag("");
      },

      render: function () {
        return (
          <div className="resource-tags">
            <a className="btn btn-primary new-tag" href="#" onClick={this.onCreateNewEmptyTag}>+ New tag</a>
            <EditTags tags={this.props.tags}
                      activeTags={this.props.activeTags}
                      onTagsChanged={this.props.onTagsChanged}
                      onEnterKeyPressed={this.onEnterKeyPressed}
            />
          </div>
        );
      }

    });

  });
