import React from 'react';
import Backbone from 'backbone';
import ResourceDetail from 'components/projects/common/ResourceDetail.react';
import Id from './details/Id.react';
import Status from './details/Status.react';
import Size from './details/Size.react';
import Identity from './details/Identity.react';

export default React.createClass({
    displayName: "VolumeDetailsSection",

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var volume = this.props.volume;

      return (
        <div className="resource-details-section section">
          <h4 className="t-title">Volume Details</h4>
          <ul>
            <Status volume={volume}/>
            <Size volume={volume}/>
            <Identity volume={volume}/>
            <Id volume={volume}/>
            <ResourceDetail label="Identifier">
              {volume.get('uuid')}
            </ResourceDetail>
          </ul>
        </div>
      );
    }

});
