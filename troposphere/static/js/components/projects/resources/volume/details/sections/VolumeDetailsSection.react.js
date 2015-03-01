/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react',

    // Resource Details
    './details/Id.react',
    './details/Status.react',
    './details/Size.react',
    './details/Identity.react'
  ],
  function (React, Backbone, ResourceDetail, Id, Status, Size, Identity) {

    return React.createClass({
      displayName: "VolumeDetailsSection",

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var providerId = this.props.volume.get('provider');
        var provider = this.props.providers.get(providerId);

        return (
          <div className="resource-details-section section">
            <h4 className="title">Volume Details</h4>
            <ul>
              <Status volume={this.props.volume} instances={this.props.instances}/>
              <Size volume={this.props.volume}/>
              <Identity volume={this.props.volume} provider={provider}/>
              <Id volume={this.props.volume}/>
            </ul>
          </div>
        );
      }

    });

  });
