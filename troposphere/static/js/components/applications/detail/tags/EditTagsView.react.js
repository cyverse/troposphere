/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'context',
    './ViewTags.react',
    './EditTags.react',
    'actions/ApplicationActions'
  ],
  function (React, Backbone, context, ViewTags, EditTags, ApplicationActions) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function(){
        return {
          isEditingTags: false
        }
      },

      onEditTags: function(e){
        e.preventDefault();
        this.setState({isEditingTags: true});
      },

      onDoneEditingTags: function(e){
        e.preventDefault();
        this.setState({isEditingTags: false});
      },

      onTagsChanged: function(tags){
        ApplicationActions.updateApplicationAttributes(this.props.application, {tags: tags});
      },

      render: function () {

        var link;
        if(this.state.isEditingTags){
          link = (
            <a href="#" onClick={this.onDoneEditingTags}>Done editing</a>
          );
        }else{
          link = (
            <a href="#" onClick={this.onEditTags}>Edit tags</a>
          );
        }

        var tagView;
        if(this.state.isEditingTags){
          tagView = (
            <EditTags tags={this.props.tags}
                      activeTags={this.props.application.get('tags')}
                      onTagsChanged={this.onTagsChanged}
            />
          );
        }else{
          tagView = (
            <ViewTags tags={this.props.tags}
                      activeTags={this.props.application.get('tags')}
            />
          )
        }

        return (
          <div className="image-tags">
            <h2 className='tag-title'>Image Tags</h2>
            {link}
            {tagView}
          </div>
        );
      }

    });

  });
