/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/StatusLight.react',
    './StatusBar.react'
  ],
  function (React, Backbone, StatusLight, StatusBar) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var state = this.props.instance.get('status').state;
        var activity = this.props.instance.get('status').activity;

        var status = state + " - " + activity;

        var style = {};
        var capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

        if(state === "error") {
          capitalizedStatus = "Launch failed. Atmosphere at capacity.";
          style = {
            color: "#d44950"
          }
        }

        return (
          <span>
            <div>
              <StatusLight status={state}/>
              <span style={style}>{capitalizedStatus}</span>
            </div>
            <StatusBar state={state} activity={activity}/>
          </span>
        );
      }

    });

  });
