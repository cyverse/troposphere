/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './DashboardHeader.react',
    './ResourceSummaryList.react',
    './CloudCapacityList.react',
    './InstanceHistoryList.react',
    './MaintenanceMessageList.react'
  ],
  function (React, Backbone, DashboardHeader, ResourceSummaryList, CloudCapacityList, InstanceHistoryList, MaintenanceMessageList) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        maintenanceMessages: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        return (
          <div id="dashboard-view">
            {false ? <DashboardHeader title="Dashboard"/> : null}
            <div className="container">
              <div className="row">

                <div className="col-md-9">
                  <div>
                    <div className="dashboard-header clearfix">
                      <h1>Dashboard</h1>
                      <a href="/application/images" className="btn btn-primary">Launch an Instance</a>
                    </div>
                  </div>
                  <ResourceSummaryList providers={this.props.providers}
                                       identities={this.props.identities}
                                       instances={this.props.instances}
                                       volumes={this.props.volumes}
                  />
                  <CloudCapacityList providers={this.props.providers}
                                     identities={this.props.identities}
                  />
                  <InstanceHistoryList/>
                </div>

                <div className="col-md-3">
                  <MaintenanceMessageList messages={this.props.maintenanceMessages}/>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
