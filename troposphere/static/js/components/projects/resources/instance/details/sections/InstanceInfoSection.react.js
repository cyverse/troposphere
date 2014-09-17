/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react',
    'components/common/EditableInputField.react',
    './ResourceTags.react',
    'actions/InstanceActions',
    'actions/TagActions',
    'stores',

    // jQuery plugins: need to make sure they're loaded, but they aren't called directly
    'chosen'
  ],
  function (React, Backbone, Time, EditableInputField, ResourceTags, InstanceActions, TagActions, stores) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function(){
        return {
          name: this.props.instance.get('name'),
          isEditing: false,
          isEditingTags: false
        }
      },

      onEnterEditMode: function(e){
        this.setState({isEditing: true});
      },

      onCreateNewTag: function(tagNameSuggestion){
        TagActions.create_AddToInstance(tagNameSuggestion, this.props.instance);
      },

      onDoneEditing: function(text){
        this.setState({
          name: text,
          isEditing: false
        });
        InstanceActions.updateInstanceAttributes(this.props.instance, {name: text})
      },

      onTagsChanged: function(text){
        var tags = text || [];
        InstanceActions.updateInstanceAttributes(this.props.instance, {tags: tags})
      },

      onEditInstanceDetails: function(e){
        e.preventDefault();
        alert("Editing instance details not yet implemented.");
      },

      render: function () {
        var instanceTags = stores.TagStore.getInstanceTags(this.props.instance);

        var nameContent;
        if(this.state.isEditing){
          nameContent = (
            <EditableInputField text={this.state.name} onDoneEditing={this.onDoneEditing}/>
          );
        }else{
          nameContent = (
            <h4 onClick={this.onEnterEditMode}>
              {this.state.name}
              <i className="glyphicon glyphicon-pencil"></i>
            </h4>
          );
        }

        return (
          <div className="resource-info-section section clearfix">

            <div className="resource-image">
              <img src="//www.gravatar.com/avatar/918bf82f238c6c264fc7701e1ff61363?d=identicon&amp;s=113" width="113" height="113"/>
            </div>

            <div className="resource-info">
              <div className="resource-name editable">
                {nameContent}
              </div>
              <div className="resource-launch-date">Launched on <Time date={this.props.instance.get('start_date')}/></div>
              <ResourceTags tags={this.props.tags}
                            activeTags={instanceTags}
                            onTagsChanged={this.onTagsChanged}
                            onCreateNewTag={this.onCreateNewTag}
              />
            </div>

          </div>
        );
      }

    });

  });
