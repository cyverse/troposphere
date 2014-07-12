/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react'
  ],
  function (React, Backbone, ResourceDetail) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var status = this.props.instance.get('status');
        var statusLight;
        if(status === "active"){
          statusLight = <span className="instance-status-light active"></span>;
        }else if(status === "suspended"){
          statusLight = <span className="instance-status-light suspended"></span>;
        }else if(status === "shutoff"){
          statusLight = <span className="instance-status-light stopped"></span>;
        }

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
            {statusLight}
            <span style={style}>{capitalizedStatus}</span>
          </ResourceDetail>
        );
      }

    });

  });
