/** @jsx React.DOM */

define(
  [
    'react',
    './Header.react',
    './ResourceSummary.react',
    './Links.react',
    './CloudCapacity.react',
    './Notifications.react'
  ],
  function (React, HeaderView, ResourceSummary, Links, CloudCapacity, Notifications) {

    return React.createClass({

      propTypes: {
        //application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <div id='dashboard-view'>
            <HeaderView/>
            <Notifications/>
            <Links/>
            <CloudCapacity/>
            <ResourceSummary/>
          </div>
        );
      }

    });

  });
