import React from 'react';
import Backbone from 'backbone';
import Button from './Button.react';
import modals from 'modals';

export default React.createClass({
    displayName: "InstanceActionButtons",

    propTypes: {
      multipleSelected: React.PropTypes.bool.isRequired,
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onStart: function () {
      modals.InstanceModals.start(this.props.instance);
    },

    onSuspend: function () {
      modals.InstanceModals.suspend(this.props.instance);
    },

    onStop: function () {
      modals.InstanceModals.stop(this.props.instance);
    },

    onReboot: function(){
      modals.InstanceModals.reboot(this.props.instance);
    },

    onResume: function () {
      modals.InstanceModals.resume(this.props.instance);
    },

    onDelete: function () {
      this.props.onUnselect(this.props.instance);
      modals.InstanceModals.destroy({
        instance: this.props.instance,
        project: this.props.project
      });
    },

    render: function () {
      var instance = this.props.instance,
        status = instance.get('state').get('status_raw'),
        linksArray = [],
        style = {marginRight: "10px"};
      if (!this.props.multipleSelected && instance.get('state').isInFinalState()) {
        if (status === "active") {
          linksArray.push(
            <Button
              style={style}
              key="Suspend"
              icon="pause"
              tooltip="Suspend"
              onClick={this.onSuspend}
              isVisible={true}
              />
          );
          linksArray.push(
            <Button
              style={style}
              key="Stop"
              icon="stop"
              tooltip="Stop"
              onClick={this.onStop}
              isVisible={true}
              />
          );
          linksArray.push(
            <Button
              style={style}
              key="Reboot"
              icon="repeat"
              tooltip="Reboot the selected instance"
              onClick={this.onReboot}
              isVisible={true}
              />
          );
        } else if (status === "suspended") {
          linksArray.push(
            <Button
              style={style}
              key="Resume"
              icon="play"
              tooltip="Resume"
              onClick={this.onResume}
              isVisible={true}
              />
          );
        } else if (status === "shutoff") {
          linksArray.push(
            <Button
              style={style}
              key="Start"
              icon="play"
              tooltip="Start"
              onClick={this.onStart}
              isVisible={true}
              />
          );
        }
      }

      linksArray.push(
        <Button
          key="Delete"
          icon="remove"
          tooltip="Delete"
          onClick={this.onDelete}
          isVisible={true}
          />
      );

      return (
        <div className="clearfix u-md-pull-right">
          {linksArray}
        </div>
      );
    }
});
