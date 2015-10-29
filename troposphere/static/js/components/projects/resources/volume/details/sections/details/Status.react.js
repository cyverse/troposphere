import React from 'react/addons';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';
import StatusLight from 'components/projects/common/StatusLight.react';
import StatusBar from 'components/projects/detail/resources/tableData/instance/StatusBar.react';
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
        status = volumeState.get('status'),
        activity = volumeState.get('activity'),
        placeholderMessage = status,
        lightStatus = "active",
        attachData = volume.get('attach_data'),
        instanceUUID = attachData.instance_id,
        instance,
        style = {};

      if (status === "available") {
        placeholderMessage = "Unattached";
      } else if (status === "in-use") {
        instance = instances.findWhere({uuid: instanceUUID});

        if (instance) {
          placeholderMessage = "Attached to " + instance.get('name');
        } else {
          placeholderMessage = "Attached to instance outside project (uuid=" + attachData.instance_id + ")";
          style = {color: "#d44950"}
        }
      } else {
        lightStatus = "transition";
      }

      return (
        <ResourceDetail label="Status">
          <div className="resource-status">
            <StatusLight status={lightStatus}/>
            <span style={style}>{placeholderMessage}</span>
            <StatusBar state={volumeState}/>
          </div>
        </ResourceDetail>
      );
    }
});
