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
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
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

      renderInstanceTableRow: function(instance, sizes){
        var size = sizes.get(instance.get('size_alias'));
        var numberOfCpus = Number(size.get('cpu'));
        var ausPerCpu = 1;
        var burnRate = ausPerCpu*numberOfCpus;

        return (
          <tr>
            <td>
              <a>{instance.get('name')}</a>
            </td>
            <td>{instance.get('status')}</td>
            <td>{numberOfCpus}</td>
            <td>{burnRate}</td>
          </tr>
        );
      },

      renderAllocation: function(identity, instances, sizes){
        var allocationConsumed = 65,
            allocationTotal = 168,
            allocationConsumedPercent = 40,
            instancesRunning = 3,
            allocationBurnRate = 20,
            timeRemaining = 15;

        if(this.state.sizes){
          return (
            <div>
              <div className="col-md-6">
                <div className="allocation-summary">
                  <p>
                    You have used <strong>{allocationConsumedPercent}% of your allocation</strong>, or {allocationConsumed} of {allocationTotal} AUs.
                  </p>
                  <div className="progress">
                    <div className="progress-bar progress-bar-success" style={{"width":"40%"}}>{allocationConsumedPercent}%</div>
                  </div>
                  <p>
                    You currently have <strong>{instancesRunning} instances</strong> running that are consuming your remaining AUs
                    at a rate of <strong>{allocationBurnRate} AUs/hour</strong>. If all of these instances continue running, you
                    will run out of allocation in <strong>{timeRemaining} hours</strong>, and all of your instances will be
                    automatically suspended.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <p>
                  You can see a list of the instances that are currently consuming your allocation below.
                </p>
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
                    {
                      instances.map(function(instance){
                        return this.renderInstanceTableRow(instance, sizes);
                      }.bind(this))
                    }
                  </tbody>
                </table>
              </div>

            </div>
          )
        }

        return (
          <div className="loading"></div>
        )
      },

      render: function () {
        var providers = new ProviderCollection([this.props.provider]);

        return (
          <div className="provider">
            <h2>{this.props.provider.get('location')}</h2>
            <p>{this.props.provider.get('description')}</p>
            <div className="row">
              {
                this.props.identities.map(function(identity){
                  return this.renderAllocation(identity, this.props.instances, this.state.sizes);
                }.bind(this))
              }
            </div>
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
