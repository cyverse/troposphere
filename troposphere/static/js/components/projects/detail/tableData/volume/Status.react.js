/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/StatusLight.react',
    '../instance/StatusBar.react'
  ],
  function (React, Backbone, StatusLight, StatusBar) {

    return React.createClass({
      displayName: "Status",

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var volumeState = this.props.volume.get('state');
        var status = volumeState.get('status');
        var activity = volumeState.get('activity');
        var placeholderMessage = status;

        if(status === "available"){
          placeholderMessage = "Unattached";
        }else if(status === "in-use"){
          var attachData = this.props.volume.get('attach_data');
          var instance = this.props.instances.get(attachData.instance_id);
          var style = {};

          if(instance) {
            placeholderMessage = "Attached to " + instance.get('name');
          }else{
            placeholderMessage = "Attached to instance outside project (" + attachData.instance_id + ")";
            style = {color: "#d44950"}
          }
        }

//        return (
//          <span>
//            {placeholderMessage}
//          </span>
//        );

        return (
          <span>
            <div>
              <StatusLight state={volumeState}/>
              <span style={style}>{placeholderMessage}</span>
            </div>
            <StatusBar state={volumeState} activity={activity}/>
          </span>
        );
      }

    });

  });
