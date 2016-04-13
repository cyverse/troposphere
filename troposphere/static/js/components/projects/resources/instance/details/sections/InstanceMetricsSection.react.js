define(function(require) {
  var React = require('react'),
    InstanceMetrics = require('./metrics/InstanceMetrics.react');

  return React.createClass({
    displayName: "InstanceMetricsSection",

    render: function() {
      var inactive = this.props.instance.get('end_date') ? true : false;
      return (
          <div>
            <div className="resource-details-section section">
              <h4 className="t-title">Instance Metrics</h4>
            </div>
            <div id="container" className="metrics">
              <InstanceMetrics
                instance={ this.props.instance }
                inactive={inactive}
              />
            </div>
          </div>
      )
    }

  })
});
