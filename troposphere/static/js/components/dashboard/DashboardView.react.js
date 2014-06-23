/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Header.react',
    './ResourceSummaryList.react',
    './Links.react',
    './CloudCapacityList.react',
    './Notifications.react'
  ],
  function (React, Backbone, HeaderView, ResourceSummaryList, Links, CloudCapacityList, Notifications) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        return (
          <div id='dashboard-view'>
            <HeaderView/>
            <Notifications/>
            <Links/>
            <CloudCapacityList providers={this.props.providers}
                               identities={this.props.identities}
            />
            <ResourceSummaryList providers={this.props.providers}
                                 identities={this.props.identities}
                                 instances={this.props.instances}
                                 volumes={this.props.volumes}
            />
          </div>
        );
      }

    });

  });
