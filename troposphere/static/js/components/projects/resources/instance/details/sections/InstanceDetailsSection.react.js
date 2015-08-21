/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react',

    // Resource Details
    './details/Id.react',
    './details/Alias.react',
    './details/Status.react',
    './details/Size.react',
    './details/IpAddress.react',
    './details/LaunchDate.react',
    './details/CreatedFrom.react',
    './details/Identity.react'
  ],
  function (React, Backbone, ResourceDetail, Id, Alias, Status, Size, IpAddress, LaunchDate, CreatedFrom, Identity) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance;

        return (
          <div className="resource-details-section section">
            <h4 className="title">Instance Details</h4>
            <ul>
              <Status instance={instance}/>
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

  });
