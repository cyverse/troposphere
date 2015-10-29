import React from 'react/addons';
import Backbone from 'backbone';
import Time from 'components/common/Time.react';
import EditableInputField from 'components/common/EditableInputField.react';
import actions from 'actions';
import stores from 'stores';
import CryptoJS from 'crypto-js';
import Gravatar from 'components/common/Gravatar.react';

export default React.createClass({
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
