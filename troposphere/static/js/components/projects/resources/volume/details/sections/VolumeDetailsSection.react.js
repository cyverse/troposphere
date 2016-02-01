define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    ResourceDetail = require('components/projects/common/ResourceDetail.react'),
    Id = require('./details/Id.react'),
    Status = require('./details/Status.react'),
    Size = require('./details/Size.react'),
    Identity = require('./details/Identity.react');

  return React.createClass({
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

});
