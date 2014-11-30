/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'collections/ProviderCollection',
    'stores'
  ],
  function (React, Backbone, ProviderCollection, stores) {

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

      renderStat: function(value, subText, moreInfo){
        return (
          <div className="col-md-3 provider-stat">
            <div>
              <span className="stat">{value}</span>
              <span className="sub-text">{subText}</span>
            </div>
            <div className="more-info">{moreInfo}</div>
          </div>
        )
      },

      renderAllocationStat: function(allocationConsumedPercent, allocationConsumed, allocationTotal){
        var allocationPercent = allocationConsumedPercent + "%";
        var usedOverTotal = "(" + allocationConsumed + "/" + allocationTotal + ") AUs";

        return this.renderStat(allocationPercent, usedOverTotal, "AUs currently used");
      },

      renderStats: function(identity, instances, sizes){
        var allocation = identity.get('quota').allocation,
            allocationConsumed = allocation.current,
            allocationTotal = allocation.threshold,
            allocationRemaining = allocationTotal - allocationConsumed,
            allocationConsumedPercent = Math.round(allocationConsumed/allocationTotal*100),
            instancesConsumingAllocation = identity.getInstancesConsumingAllocation(instances),
            allocationBurnRate = identity.getCpusUsed(instancesConsumingAllocation, sizes),
            timeRemaining = allocationRemaining/allocationBurnRate,
            width = allocationConsumedPercent > 100 ? 100 : allocationConsumedPercent;

        return (
          <div className="row provider-info-section provider-stats">
            {this.renderAllocationStat(allocationConsumedPercent, allocationConsumed, allocationTotal)}
            {this.renderStat(instancesConsumingAllocation, "instances", "Number of instances consuming allocation")}
            {this.renderStat(timeRemaining, "hours", "Time remaining before allocation runs out")}
            {this.renderStat(allocationBurnRate, "AUs/hour", "Rate at which AUs are being used")}
          </div>
        )
      },

      renderAllocation: function(identity, instances, sizes){
        var allocation = identity.get('quota').allocation,
            allocationConsumed = allocation.current,
            allocationTotal = allocation.threshold,
            allocationRemaining = allocationTotal - allocationConsumed,
            allocationConsumedPercent = Math.round(allocationConsumed/allocationTotal*100),
            instancesConsumingAllocation = identity.getInstancesConsumingAllocation(instances),
            allocationBurnRate = identity.getCpusUsed(instancesConsumingAllocation, sizes),
            timeRemaining = allocationRemaining/allocationBurnRate,
            width = allocationConsumedPercent > 100 ? 100 : allocationConsumedPercent;

        return (
          <div>
            <div className="col-md-6">
              <div className="allocation-summary">
                <p>
                  You have used <strong>{allocationConsumedPercent}% of your allocation</strong>, or {allocationConsumed} of {allocationTotal} AUs.
                </p>
                <div className="progress">
                  <div className="progress-bar progress-bar-success" style={{"width": width + "%"}}>{allocationConsumedPercent}%</div>
                </div>
                <p>
                  You currently have <strong>{instancesConsumingAllocation.length} instances</strong> running that are consuming your remaining AUs
                  at a rate of <strong>{allocationBurnRate} AUs/hour</strong>. If all of these instances continue running, you
                  will run out of allocation in <strong>{timeRemaining} hours</strong>, and all of your instances will be
                  automatically suspended.
                </p>
              </div>
            </div>
          </div>
        )
      },

      render: function () {
        var identity = this.props.identities.first(),
            instances = this.props.instances,
            sizes = this.state.sizes;

        if(sizes){
          return this.renderStats(identity, instances, sizes);
        }

        return (
          <div className="loading"></div>
        )
      }
    });

  });
