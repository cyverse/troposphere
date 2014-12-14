/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'context',
    'components/common/tags/ViewTagsView.react',
    'components/common/tags/EditTagsView.react',
    'actions/ApplicationActions',
    'actions/TagActions',
    'stores'
  ],
  function (React, Backbone, context, ViewTagsView, EditTagsView, ApplicationActions, TagActions, stores) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      onTagsChanged: function(tags){
        ApplicationActions.updateApplicationAttributes(this.props.application, {tags: tags});
      },

      onCreateNewTag: function(tagNameSuggestion){
        TagActions.create(tagNameSuggestion);
      },

      render: function () {
        var applicationTags = stores.TagStore.getImageTags(this.props.application);

        if(context.profile && context.profile.get('username') === this.props.application.get('created_by')){
          return (
            <div className="image-tags">
              <EditTagsView tags={this.props.tags}
                            activeTags={applicationTags}
                            onTagsChanged={this.onTagsChanged}
                            onCreateNewTag={this.onCreateNewTag}
                            label={"Tags"}
              />
            </div>
          );

        }else{
          return (
            <div className="image-tags">
              <ViewTagsView tags={this.props.tags}
                            activeTags={applicationTags}
              />
            </div>
          );
        }

      }

    });

  });
