/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'collections/ProviderCollection',
    'components/dashboard/plots/ResourceStatusSummaryPlot.react',
    'components/dashboard/plots/ProviderSummaryLinePlot.react',
    'stores'
  ],
  function (React, Backbone, ProviderCollection, ResourceStatusSummaryPlot, ProviderSummaryLinePlot, stores) {

    return React.createClass({

      propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function () {
        return this.getState();
      },

      getState: function(){
        var identity = this.props.identities.first();
        return {
          sizes: stores.SizeStore.getAllFor(identity.get('provider_id'), identity.id)
        }
      },

      updateState: function () {
        if (this.isMounted()) this.setState(this.getState());
      },

      componentDidMount: function () {
        stores.SizeStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.SizeStore.removeChangeListener(this.updateState);
      },

      render: function () {
        var providers = new ProviderCollection([this.props.provider]);

        if(this.state.sizes){
          return (
            <div className="provider">
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

        return (
          <div className="loading"></div>
        )
      }
    });

  });
