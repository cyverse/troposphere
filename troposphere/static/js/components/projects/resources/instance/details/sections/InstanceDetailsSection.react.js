import React from 'react';
import Backbone from 'backbone';

// Resource Detail;
import Id from './details/Id.react';
import Alias from './details/Alias.react';
import Status from './details/Status.react';
import Activity from './details/Activity.react';
import Size from './details/Size.react';
import IpAddress from './details/IpAddress.react';
import LaunchDate from './details/LaunchDate.react';
import CreatedFrom from './details/CreatedFrom.react';
import Identity from './details/Identity.react';

export default React.createClass({
    displayName: "InstanceDetailsSection",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
        var instance = this.props.instance;

        return (
          <div className="resource-details-section section">
            <h4 className="t-title">Instance Details</h4>
            <ul style={{paddingLeft: "10px"}}>
              <Status instance={instance}/>
              <Activity instance={instance}/>
              <Size instance={instance}/>
              <IpAddress instance={instance}/>
              <LaunchDate instance={instance}/>
              <CreatedFrom instance={instance}/>
              <Identity instance={instance}/>
              <Id instance={instance}/>
              <Alias instance={instance}/>
            </ul>
          </div>
        );
    }
});
