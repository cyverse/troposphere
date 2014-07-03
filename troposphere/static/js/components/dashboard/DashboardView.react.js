/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Header.react',
    './ResourceSummaryList.react',
    './CloudCapacityList.react'
  ],
  function (React, Backbone, HeaderView, ResourceSummaryList, CloudCapacityList) {

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
            <ResourceSummaryList providers={this.props.providers}
                                 identities={this.props.identities}
                                 instances={this.props.instances}
                                 volumes={this.props.volumes}
            />
            <CloudCapacityList providers={this.props.providers}
                               identities={this.props.identities}
            />
          </div>
        );
      }

    });

  });
