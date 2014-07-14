/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/StatusLight.react'
  ],
  function (React, Backbone, StatusLight) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var status = this.props.instance.get('status');
        var style = {};
        var capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

        if(capitalizedStatus === "Error") {
          capitalizedStatus = "Launch failed. Atmosphere at capacity.";
          style = {
            color: "#d44950"
          }
        }

        return (
          <span>
            <StatusLight instance={this.props.instance}/>
            <span style={style}>{capitalizedStatus}</span>
          </span>
        );
      }

    });

  });
