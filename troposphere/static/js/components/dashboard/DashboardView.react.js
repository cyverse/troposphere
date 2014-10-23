/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './CloudCapacityList.react',
    './InstanceHistoryList.react',
    './MaintenanceMessageList.react',
    './plots/ResourceStatusSummaryPlot.react',
    './plots/ProviderSummaryLinePlot.react',
    './CallToAction.react',
    'url'
  ],
  function (React, Backbone, CloudCapacityList, InstanceHistoryList, MaintenanceMessageList, ResourceStatusSummaryPlot, ProviderSummaryLinePlot, CallToAction, URL) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        maintenanceMessages: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        applications: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      renderAllocation: function(){
        return (
          <div>
            <h2>Allocation</h2>
            <div className="row">
              <div className="col-md-12">
                <div className="allocation-summary">
                  <p>
                    You have used <strong>40% of your allocation</strong>, or 65 of 168 AUs.
                  </p>
                  <div className="progress">
                    <div className="progress-bar progress-bar-success" style={{"width":"40%"}}>40%</div>
                  </div>
                  <p>
                    You currently have <strong>3 instances</strong> running that are consuming your remaining AUs
                    at a rate of <strong>20 AUs/hour</strong>. If all of these instances continue running, you
                    will run out of allocation in <strong>15 hours</strong>, and all of your instances will be
                    automatically suspended.
                  </p>
                  <p>
                    You can see a list of the instances that are currently consuming your allocation below.
                  </p>
                </div>
                <table className="table table-striped table-condensed">
                  <thead>
                    <tr>
                      <th>Instance</th>
                      <th>Status</th>
                      <th>CPUs</th>
                      <th>AUs/hour</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><a>Mark</a></td>
                      <td>Active</td>
                      <td>1</td>
                      <td>1</td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td><a>Susan</a></td>
                      <td>Active</td>
                      <td>2</td>
                      <td>2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
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
            <div className="container">
              <div className="row">

                <div className="col-md-9">

                  <h2>Getting Started</h2>
                  <div className="row calls-to-action">
                    <div className="col-md-3">
                      <CallToAction title="Launch New Instance"
                                    image="/assets/images/icon_launchnewinstance.png"
                                    description="Browse Atmosphere's list of available images and select one to launch a new instance."
                                    link={URL.images()}
                      />
                    </div>
                    <div className="col-md-3">
                      <CallToAction title="Browse Help Resources"
                                    image="/assets/images/icon_gethelp.png"
                                    description="View a video tutorial, read the how-to guides, or email the Atmosphere support team."
                                    link={URL.help()}
                      />
                    </div>
                    <div className="col-md-3">
                      <CallToAction title="Change Your Settings"
                                    image="/assets/images/icon_settings.png"
                                    description="Modify your account settings, view your resource quota, or request more resources."
                                    link={URL.settings()}
                      />
                    </div>
                  </div>

                  {this.renderAllocation()}

                  <h2>Resources in Use</h2>
                  <div className="row">
                    <div className="col-md-8">
                      <ProviderSummaryLinePlot providers={this.props.providers}
                                               identities={this.props.identities}
                                               instances={this.props.instances}
                                               volumes={this.props.volumes}
                                               isPolarPlot={false}
                      />
                    </div>
                    <div className="col-md-4">
                      <ResourceStatusSummaryPlot title="Instances" resources={this.props.instances}/>
                      <ResourceStatusSummaryPlot title="Volumes" resources={this.props.volumes}/>
                    </div>
                  </div>

                  <InstanceHistoryList/>
                </div>

                <div className="col-md-3">
                  <MaintenanceMessageList messages={this.props.maintenanceMessages}
                                          applications={this.props.applications}
                  />
                </div>

              </div>
            </div>
          </div>
        );
      }

    });

  });
