define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Time = require('components/common/Time.react'),
    EditableInputField = require('components/common/EditableInputField.react'),
    actions = require('actions'),
    stores = require('stores'),
    CryptoJS = require('crypto-js'),
    Gravatar = require('components/common/Gravatar.react');

  return React.createClass({
    displayName: "VolumeInfoSection",

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function () {
      var volume = this.props.volume;

      return {
        name: volume.get('name'),
        isEditing: false
      }
    },

    onEnterEditMode: function (e) {
      this.setState({isEditing: true});
    },

    onDoneEditing: function (text) {
      var volume = this.props.volume;

      this.setState({
        name: text,
        isEditing: false
      });
      actions.VolumeActions.update(volume, {name: text})
    },

    render: function () {
      var volume = this.props.volume,
        profile = stores.ProfileStore.get(),
        type = profile.get('icon_set'),
        instanceHash = CryptoJS.MD5((volume.id || volume.cid).toString()).toString(),
        iconSize = 113,
        nameContent;

      if (this.state.isEditing) {
        nameContent = (
          <EditableInputField text={this.state.name} onDoneEditing={this.onDoneEditing}/>
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
            <div className="resource-launch-date">
              Launched on <Time date={volume.get('start_date')}/>
            </div>
          </div>

        </div>
      );
    }

  });

});
