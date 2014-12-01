/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'stores'
  ],
  function (React, Backbone, stores) {

    return React.createClass({

      propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function () {
        return this.getState();
      },

      getState: function(){
        var identity = this._getIdentity();
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

      //
      // Helper Functions
      //

      _getIdentity: function(){
        var provider = this.props.provider;
        return this.props.identities.findWhere({
          provider_id: provider.id
        });
      },

      //
      // Render
      //

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
            timeRemaining = allocationRemaining/allocationBurnRate;

        return (
          <div className="row provider-info-section provider-stats">
            {this.renderAllocationStat(allocationConsumedPercent, allocationConsumed, allocationTotal)}
            {this.renderStat(instancesConsumingAllocation.length, "instances", "Number of instances consuming allocation")}
            {this.renderStat(timeRemaining, "hours", "Time remaining before allocation runs out")}
            {this.renderStat(allocationBurnRate, "AUs/hour", "Rate at which AUs are being used")}
          </div>
        )
      },

      render: function () {
        var identity = this._getIdentity(),
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
