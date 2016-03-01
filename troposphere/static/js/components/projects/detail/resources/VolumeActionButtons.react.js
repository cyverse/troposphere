import React from 'react';
import Backbone from 'backbone';
import Button from './Button.react';
import actions from 'actions';
import modals from 'modals';

export default React.createClass({
    displayName: "VolumeActionButtons",

    propTypes: {
      multipleSelected: React.PropTypes.bool.isRequired,
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onAttach: function () {
      modals.InstanceVolumeModals.attach(this.props.volume, this.props.project);
    },

    onDetach: function () {
      modals.InstanceVolumeModals.detach(this.props.volume);
    },

    onDelete: function () {
      this.props.onUnselect(this.props.volume);
      modals.VolumeModals.destroy({
        volume: this.props.volume,
        project: this.props.project
      });
    },

    render: function () {
      var volume = this.props.volume,
        status = volume.get('state').get('status'),
        linksArray = [];

      // Add in the conditional links based on current machine state
      if (!this.props.multipleSelected && status === "available") {
        linksArray.push(
          <Button
            key="Attach"
            icon="save"
            tooltip="Attach"
            onClick={this.onAttach}
            isVisible={true}
            />
        );
      } else if (!this.props.multipleSelected && status === "in-use") {
        linksArray.push(
          <Button
            key="Detach"
            icon="open"
            tooltip="Detach"
            onClick={this.onDetach}
            isVisible={true}
            />
        );
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
        <div style={{borderLeft: "1px solid #ddd", display: "inline-block", paddingLeft: "10px", float: "right"}}>
          {linksArray}
        </div>
      );
    }

});
