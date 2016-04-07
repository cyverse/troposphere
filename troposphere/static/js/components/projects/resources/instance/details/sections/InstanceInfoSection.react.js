define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Time = require('components/common/Time.react'),
    EditableInputField = require('components/common/EditableInputField.react'),
    ResourceTags = require('./ResourceTags.react'),
    actions = require('actions'),
    stores = require('stores'),
    modals = require('modals'),
    CryptoJS = require('crypto-js'),
    Gravatar = require('components/common/Gravatar.react');

  return React.createClass({
    displayName: "InstanceInfoSection",

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function () {
      var instance = this.props.instance;

      return {
        name: instance.get('name'),
        isEditing: false,
        isEditingTags: false
      }
    },

    onEnterEditMode: function (e) {
      this.setState({isEditing: true});
    },

    onDoneEditing: function (text) {
      this.setState({
        name: text,
        isEditing: false
      });
      actions.InstanceActions.update(this.props.instance, {name: text});
    },

    render: function () {
      var instance = this.props.instance,
        instanceHash = CryptoJS.MD5((instance.id || instance.cid).toString()).toString(),
        type = stores.ProfileStore.get().get('icon_set'),
        iconSize = 113,
        nameContent;

      if (this.state.isEditing) {
        nameContent = (
          <EditableInputField
            text={this.state.name}
            onDoneEditing={this.onDoneEditing}
            />
        );
      } else {
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
          </div>

        </div>
      );
    }

  });

});
