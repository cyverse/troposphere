import React from "react";
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import Backbone from "backbone";
import PercentageGraph from 'components/common/ui/PercentageGraph.react';

/**
 * Finds a maximum within the data points for all providers
 *
 * If the maximum does not exceed the _soft_ limit, `ceiling`, return
 * the greatest value present.
 *
 * @param {object} seriesData - array of provider's series data [1]
 * @param {int} ceiling - y Axis soft limit
 *
 * [1] http://api.highcharts.com/highcharts#plotOptions.series
 */
function findMaxDataPt(seriesData, ceiling) {
    // series data has an array of data points *per* provider
    // - we need to know the max value to set the Y Axis
    return Math.max(
        ceiling,
        Math.max(...seriesData.map(
            (provider) => Math.max(...provider.data))
        )
    );
}

export default React.createClass({
      displayName: "ProviderSummaryLinePlot",

      propTypes: {
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        identities: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
      },

      //
      // Helper Methods
      // */

      getChartData: function () {
        var summaries = [];
        this.props.identities.map(function (identity) {
          var data = this.getDataForIdentity(identity);
          if (data) summaries.push(data);
        }.bind(this));
        return summaries;
      },

      getDataForIdentity: function (identity) {
        var provider = this.props.providers.get(identity.get("provider").id),
            allocation = identity.get('usage');

        // Allocation Usage
        var allocationUsageStats = this.calculateAllocationUsage(allocation),
          allocationUsage = allocationUsageStats.percentUsed * 100;

        var seriesData = {
          name: provider.get('name'),
          data: [allocationUsage],
          limits: {
              Allocation:  allocationUsageStats.maxAllocation
          },
          appendMessages: {
            Allocation: "AUs",
          },
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            formatter: function() {
                if (this.y != 0) {
                    return (Math.round(this.y * 100) / 100) + '%';
                } else {
                    return null;
                }
            }
          },
          animation: false
        };

        return seriesData;
      },

      calculateAllocationUsage: function (allocation) {
        var maxAllocation = allocation.threshold;
        var currentAllocation = allocation.current;

        return {
          currentUsage: currentAllocation,
          maxAllocation: maxAllocation,
          percentUsed: currentAllocation / maxAllocation
        };
      },

      //
      // Render
      //

      render: function () {
        return (
            <div>
                <h2 className="t-title">
                    Provider Resources
                </h2>
                <PercentageGraph
                    seriesData={ this.getChartData() }
                    categories={ ['Allocation'] }
                />
            </div>
        );
      }

});
