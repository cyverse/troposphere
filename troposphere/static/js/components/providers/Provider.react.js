/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'collections/ProviderCollection',
    'components/dashboard/plots/ResourceStatusSummaryPlot.react',
    'components/dashboard/plots/ProviderSummaryLinePlot.react'
  ],
  function (React, Backbone, ProviderCollection, ResourceStatusSummaryPlot, ProviderSummaryLinePlot) {

    return React.createClass({

      propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var providers = new ProviderCollection([this.props.provider]);

        return (
          <div className="provider">
            <h2>{this.props.provider.get('location')}</h2>
            <p>{this.props.provider.get('description')}</p>
            <div className="row">
              <div className="col-md-8">
                <ProviderSummaryLinePlot providers={providers}
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

          </div>
        );
      }
    });

  });
