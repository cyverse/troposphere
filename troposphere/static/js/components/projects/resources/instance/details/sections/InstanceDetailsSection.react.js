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
        return (
          <div className="resource-details-section section">
            <h4 className="title">Instance Details</h4>
            <ul>
              <Status instance={this.props.instance}/>
              <Size size={this.props.size}/>
              <IpAddress instance={this.props.instance}/>
              <LaunchDate instance={this.props.instance}/>
              <CreatedFrom instance={this.props.instance}/>
              <Identity instance={this.props.instance} provider={this.props.provider}/>
              <Id instance={this.props.instance}/>
            </ul>
          </div>
        );
      }

    });

  });
