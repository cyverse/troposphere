/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Header.react',
    './ResourceSummary.react',
    './Links.react',
    './CloudCapacityList.react',
    './Notifications.react'
  ],
  function (React, Backbone, HeaderView, ResourceSummary, Links, CloudCapacityList, Notifications) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        return (
          <div id='dashboard-view'>
            <HeaderView/>
            <Notifications/>
            <Links/>
            <CloudCapacityList providers={this.props.providers} identities={this.props.identities}/>
            <ResourceSummary/>
          </div>
        );
      }

    });

  });
