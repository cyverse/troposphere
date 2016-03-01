import React from 'react/addons';
import Backbone from 'backbone';
import StatusLight from 'components/projects/common/StatusLight.react';
import StatusBar from '../instance/StatusBar.react';
import stores from 'stores';

export default React.createClass({
    displayName: "Status",

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var volume = this.props.volume,
        instances = stores.InstanceStore.getAll(),
        volumeState = volume.get('state'),
        attachData = volume.get('attach_data'),
        status = volumeState.get('status'),
        activity = volumeState.get('activity'),
        placeholderMessage = status,
        lightStatus = "active",
        style = {},
        instance;

      if (status === "available") {
        placeholderMessage = "Unattached";
      } else if (status === "in-use") {
        instance = instances.find(function (i) {
          return i.get('uuid') === attachData.instance_id;
        });

        if (instance) {
          placeholderMessage = "Attached to " + instance.get('name');
        } else {
          console.error("Volume cannot be in use and not attached to an instance");
        }
      } else {
        lightStatus = "transition";
      }

      return (
          <div className="resource-status">
            <StatusLight status={lightStatus}/>
            <span style={style}>{placeholderMessage}</span>
            <StatusBar state={volumeState} activity={activity}/>
          </div>
      );
    }
});
