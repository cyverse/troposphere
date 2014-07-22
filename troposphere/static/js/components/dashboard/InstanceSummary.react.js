/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var summaryGroups = {};
        this.props.instances.map(function (instance) {
          var status = instance.get('status');
          summaryGroups[status] = (summaryGroups[status] || 0);
          summaryGroups[status] += 1;
        }.bind(this));

        var summaries = Object.keys(summaryGroups).map(function (status) {
          return (
            <div key={status}>{summaryGroups[status] + " " + status}</div>
          );
        }.bind(this));

        var title = this.props.instances.length + " Instances";

        return (
          <div className="resource-summary col-md-3">
            <h3>{title}</h3>
            {summaries}
          </div>
        );
      }

    });

  });
