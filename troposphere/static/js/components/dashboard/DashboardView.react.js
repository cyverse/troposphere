/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './DashboardHeader.react',
    './ResourceSummaryList.react',
    './CloudCapacityList.react',
    './InstanceHistoryList.react',
    './MaintenanceMessageList.react',
    './plots/LineBasic.react',
    './plots/PolarSpider.react',
    './plots/PieDonut.react'
  ],
  function (React, Backbone, DashboardHeader, ResourceSummaryList, CloudCapacityList, InstanceHistoryList, MaintenanceMessageList, LineBasic, PolarSpider, PieDonut) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        maintenanceMessages: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {

        // todo: show cloud capacity again when we have a better idea of what to show
        // var cloudCapacity = (
        //   <CloudCapacityList providers={this.props.providers}
        //                      identities={this.props.identities}
        //   />
        // );

        return (
          <div id="dashboard-view">
            {false ? <DashboardHeader title="Dashboard"/> : null}
            <div className="container">
              <h2>Resources in Use</h2>
              <div className="row">
                <div className="col-md-6">
                  <LineBasic/>
                </div>
                <div className="col-md-3">
                  <PieDonut/>
                  <PieDonut/>
                </div>
              </div>
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
