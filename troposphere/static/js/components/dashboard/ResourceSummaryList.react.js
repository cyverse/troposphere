/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceSummary.react',
    './VolumeSummary.react',
    './ProviderSummaryList.react'
  ],
  function (React, Backbone, InstanceSummary, VolumeSummary, ProviderSummaryList) {

    return React.createClass({

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        return (
          <div className="">
            <h2>Resources in Use</h2>
            <div className="row">
              <InstanceSummary instances={this.props.instances}/>
              <VolumeSummary volumes={this.props.volumes}/>
              <ProviderSummaryList providers={this.props.providers}
                                   identities={this.props.identities}
                                   instances={this.props.instances}
                                   volumes={this.props.volumes}
              />
            </div>
          </div>
        );
      }

    });

  });
