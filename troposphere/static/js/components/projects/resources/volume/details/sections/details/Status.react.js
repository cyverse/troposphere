/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react'
  ],
  function (React, Backbone, ResourceDetail) {

    return React.createClass({
      displayName: "Status",

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired // only required if volume attached
      },

      render: function () {
        var status = this.props.volume.get('status'),
            placeholderMessage = status;

        if(status === "available"){
          placeholderMessage = "Unattached";
        }else if(status === "in-use"){
          var attachData = this.props.volume.get('attach_data');
          var instance = this.props.instances.get(attachData.instance_id);
          if(instance) {
            placeholderMessage = "Attached to " + instance.get('name') + " as device " + attachData.device;
          }else{
            placeholderMessage = "Attached to instance outside project (" + attachData.instance_id + ")";
          }
        }

        return (
          <ResourceDetail label="Status">
            {placeholderMessage}
          </ResourceDetail>
        );
      }

    });

  });
