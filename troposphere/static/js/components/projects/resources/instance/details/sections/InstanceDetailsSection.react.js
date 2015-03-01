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
    './details/IpAddress.react',
    './details/LaunchDate.react',
    './details/CreatedFrom.react',
    './details/Identity.react'
  ],
  function (React, Backbone, ResourceDetail, Id, Status, Size, IpAddress, LaunchDate, CreatedFrom, Identity) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        size: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance,
            size = this.props.size,
            provider = this.props.provider;

        return (
          <div className="resource-details-section section">
            <h4 className="title">Instance Details</h4>
            <ul>
              <Status instance={instance}/>
              <Size instance={instance}/>
              <IpAddress instance={instance}/>
              <LaunchDate instance={instance}/>
              <CreatedFrom instance={instance}/>
              <Identity instance={instance} provider={provider}/>
              <Id instance={instance}/>
            </ul>
          </div>
        );
      }

    });

  });
