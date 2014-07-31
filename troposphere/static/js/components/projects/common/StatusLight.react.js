/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        state: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var status = this.props.state.get('status');
        var statusLight;

        if(status === "active"){
          statusLight = <span className="instance-status-light active"></span>;
        }else if(status === "suspended"){
          statusLight = <span className="instance-status-light suspended"></span>;
        }else if(status === "shutoff"){
          statusLight = <span className="instance-status-light stopped"></span>;
        }else{
          statusLight = <span></span>;
        }

        return (
          statusLight
        );
      }

    });

  });
