import React from 'react';
import Backbone from 'backbone';
import Time from 'components/common/Time.react';
import EditableInputField from 'components/common/EditableInputField.react';
import ResourceTags from './ResourceTags.react';
import actions from 'actions';
import stores from 'stores';
import modals from 'modals';
import CryptoJS from 'crypto-js';
import Gravatar from 'components/common/Gravatar.react';

var InstanceInfoSection = React.createClass({
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

export default InstanceInfoSection;
