define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    stores = require('stores');

  return React.createClass({
    displayName: "Stats",

    propTypes: {
      provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    //
    // Helper Functions
    //

    _getIdentity: function () {
      var provider = this.props.provider;
      return this.props.identities.find(function (identity) {
        return identity.get('provider').id === provider.id;
      });
    },

    //
    // Render
    //

    renderStat: function (value, subText, moreInfo) {
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

    renderAllocationStat: function (allocationConsumedPercent, allocationConsumed, allocationTotal) {
      var allocationPercent = allocationConsumedPercent + "%";
      var usedOverTotal = "(" + allocationConsumed + "/" + allocationTotal + ") AUs";

      return this.renderStat(allocationPercent, usedOverTotal, "AUs currently used");
    },

    renderStats: function(identity, instances, sizes){
      var allocation = identity.get('usage');
      var allocationConsumed = allocation.current;
      var allocationTotal = allocation.threshold;
      var allocationRemaining = allocationTotal - allocationConsumed;
      var allocationConsumedPercent = Math.round(allocationConsumed / allocationTotal * 100);
      var instancesConsumingAllocation = identity.getInstancesConsumingAllocation(instances);
      var allocationBurnRate = identity.getCpusUsed(instancesConsumingAllocation, sizes);
      var timeRemaining = allocationRemaining / allocationBurnRate;
      var timeRemainingSubText = "hours";

      if (!isFinite(timeRemaining)) {
        timeRemaining = "N/A";
        timeRemainingSubText = "";
      } else {
        timeRemaining = Math.round(timeRemaining);
      }

      return (
        <div className="row provider-info-section provider-stats">
          {this.renderAllocationStat(allocationConsumedPercent, allocationConsumed, allocationTotal)}
          {this.renderStat(instancesConsumingAllocation.length, "instances", "Number of instances consuming allocation")}
          {this.renderStat(timeRemaining, timeRemainingSubText, "Time remaining before allocation runs out")}
          {this.renderStat(allocationBurnRate, "AUs/hour", "Rate at which AUs are being used")}
        </div>
      )
    },

    render: function () {
      var provider = this.props.provider,
        identity = stores.IdentityStore.findOne({'provider.id': provider.id}),
        instances = stores.InstanceStore.findWhere({'provider.id': provider.id}),
        sizes = stores.SizeStore.fetchWhere({
          provider__id: provider.id,
          archived: true,
          page_size: 100
        });

      if (!provider || !identity || !instances || !sizes) {
        return (
          <div className="loading"></div>
        )
      }

      return this.renderStats(identity, instances, sizes);
    }

  });

});
