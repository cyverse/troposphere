/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './DashboardHeader.react',
    './ResourceSummaryList.react',
    './CloudCapacityList.react',
    './InstanceSummary.react'
  ],
  function (React, Backbone, DashboardHeader, ResourceSummaryList, CloudCapacityList, InstanceSummary) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        return (
          <div id="dashboard-view">
            <DashboardHeader title="Dashboard"/>
            <div className="container">
              <div className="col-md-9">
                <a href="/application/images" className="btn btn-primary pull-right">Launch an Instance</a>
                <ResourceSummaryList providers={this.props.providers}
                                     identities={this.props.identities}
                                     instances={this.props.instances}
                                     volumes={this.props.volumes}
                />
                <InstanceSummary instances={this.props.instances}/>
                <CloudCapacityList providers={this.props.providers}
                                   identities={this.props.identities}
                />
              </div>
              <div className="col-md-3">
                <ul className="notifications">
                  <li>
                    <div className="title">
                      <i className="glyphicon glyphicon-pushpin"></i>
                      <span>Scheduled Maintenance</span>
                    </div>
                    <div className="message">
                      Atmosphere will undergo scheduled maintanence from 9:ooAM - 5:00PM (MST).
                    </div>
                  </li>
                  <li>
                    <div className="title">
                      <i className="glyphicon glyphicon-pushpin"></i>
                      <span>Scheduled Maintenance</span>
                    </div>
                    <div className="message">
                      Atmosphere will undergo scheduled maintanence from 9:ooAM - 5:00PM (MST).
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      }

    });

  });
