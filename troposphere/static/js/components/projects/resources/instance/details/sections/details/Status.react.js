/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react',
    'components/projects/common/StatusLight.react'
  ],
  function (React, Backbone, ResourceDetail, StatusLight) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instanceState = this.props.instance.get('state');
        var status = instanceState.get('status');
        var style = {};
        var capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

        if(capitalizedStatus === "Error") {
          capitalizedStatus = "Launch failed. Atmosphere at capacity.";
          style = {
            color: "#d44950"
          }
        }

        return (
          <ResourceDetail label="Status">
            <StatusLight state={instanceState}/>
            <span style={style}>{capitalizedStatus}</span>
          </ResourceDetail>
        );
      }

    });

  });
