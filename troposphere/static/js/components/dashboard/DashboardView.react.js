/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './ResourceSummaryList.react',
    './CloudCapacityList.react',
    './InstanceHistoryList.react',
    './MaintenanceMessageList.react',
    './plots/ResourceStatusSummaryPlot.react',
    './plots/ProviderSummaryLinePlot.react',
    './CallToAction.react',
    'url'
  ],
  function (React, Backbone, ResourceSummaryList, CloudCapacityList, InstanceHistoryList, MaintenanceMessageList, ResourceStatusSummaryPlot, ProviderSummaryLinePlot, CallToAction, URL) {

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
            <div className="container">
              <div className="row">

                <div className="col-md-9">

                  <h2>Calls to Action</h2>
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
                  <MaintenanceMessageList messages={this.props.maintenanceMessages}/>
                </div>
                
              </div>
            </div>
          </div>
        );
      }

    });

  });
