define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      Time = require('components/common/Time.react'),
      EditableInputField = require('components/common/EditableInputField.react'),
      ResourceTags = require('./ResourceTags.react'),
      actions = require('actions'),
      stores = require('stores'),
      CryptoJS = require('crypto'),
      Gravatar = require('components/common/Gravatar.react');

  return React.createClass({
    display: "InstanceInfoSection",

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
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
      actions.TagActions.create_AddToInstance(tagNameSuggestion, this.props.instance);
    },

    onDoneEditing: function(text){
      this.setState({
        name: text,
        isEditing: false
      });
      actions.InstanceActions.updateInstanceAttributes(this.props.instance, {name: text})
    },

    onTagsChanged: function(text){
      var tags = text || [];
      actions.InstanceActions.updateInstanceAttributes(this.props.instance, {tags: tags})
    },

    render: function () {
      var instance = this.props.instance,
          tags = stores.TagStore.getAll(),
          instanceTags = stores.InstanceTagStore.getTagsFor(this.props.instance),
          instanceHash = CryptoJS.MD5(instance.id.toString()).toString(),
          type = stores.ProfileStore.get().get('icon_set'),
          iconSize = 113,
          nameContent;

      if(!tags || !instanceTags) return <div className="loading"></div>;

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
            <Gravatar hash={instanceHash} size={iconSize} type={type}/>
          </div>

          <div className="resource-info">
            <div className="resource-name editable">
              {nameContent}
            </div>
            <div className="resource-launch-date">Launched on <Time date={instance.get('start_date')}/></div>
            <ResourceTags
              tags={tags}
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
