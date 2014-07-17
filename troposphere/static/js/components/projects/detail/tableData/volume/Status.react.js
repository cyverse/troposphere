/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var status = this.props.volume.get('status'),
            placeholderMessage = status;

        if(status === "available"){
          placeholderMessage = "Unattached";
        }else if(status === "in-use"){
          var attachData = this.props.volume.get('attach_data');
          var instance = this.props.instances.get(attachData.instance_id);
          placeholderMessage = "Attached to " + instance.get('name') + " as device " + attachData.device;
        }

        return (
          <span>
            {placeholderMessage}
          </span>
        );
      }

    });

  });
