/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'moment'
  ],
  function (React, Backbone, moment) {

    return React.createClass({

      propTypes: {
        message: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getMaintenanceDateTimeMessage: function(message){
        var currentDate = moment();
        var startDate = message.get('start_date');
        var endDate = message.get('end_date');
        var isInMaintenance = currentDate.diff(startDate) > 0;

        var message;
        if(isInMaintenance){
          return (
            <div>
              {"Maintenance is currently underway and will end on "}
              <strong>{endDate.format("MMM Do")} at {endDate.format("h:mma")}</strong>
            </div>
          )
        }

        if(startDate.format("MM D") === endDate.format("MM D")) {
          return (
            <div>
              {"Maintenance is scheduled to performed on "}
              <strong>{startDate.format("MMM Do")} from {startDate.format("h:mma") + "-" + endDate.format("h:mma")}</strong>
            </div>
          )
        }

        return (
          <div>
            {"Maintenance is scheduled to performed on "}
            <strong>{startDate.format("MMM Do")} at {startDate.format("h:mma")}</strong>
            {" and ending on "}
            <strong>{endDate.format("MMM Do")} at {endDate.format("h:mma")}</strong>
          </div>
        );
      },

      render: function () {
        var message = this.props.message;

        return (
          <li className="sticky">
            <div className="title">
              <i className="glyphicon glyphicon-pushpin"></i>
              <span>{message.get('title')}</span>
            </div>
            <div className="date">
              {this.getMaintenanceDateTimeMessage(message)}
            </div>
            <div className="message">
              {message.get('message')}
            </div>
          </li>
        );
      }

    });

  });
