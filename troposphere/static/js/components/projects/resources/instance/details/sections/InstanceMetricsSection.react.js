define(function(require) {
  var React = require('react'),
    InstanceMetrics = require('./metrics/InstanceMetrics.react');

  return React.createClass({
    displayName: "InstanceMetricsSection",

    return (
        <div>
          <div className="resource-details-section section">
            <h4 className="title">Instance Metrics</h4>
          </div>
          <div id="container" className="metrics"> 
            <InstanceMetrics 
              instance={ this.props.instance } 
            />
          </div> 
        </div>
    )
    }

  })
});
