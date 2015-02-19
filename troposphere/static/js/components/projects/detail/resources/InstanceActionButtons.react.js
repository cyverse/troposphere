/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Button.react',
    'actions'
  ],
  function (React, Backbone, Button, actions) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onStart: function(){
        actions.InstanceActions.start(this.props.instance);
      },

      onSuspend: function(){
        actions.InstanceActions.suspend(this.props.instance);
      },

      onStop: function(){
        actions.InstanceActions.stop(this.props.instance);
      },

      onResume: function(){
        actions.InstanceActions.resume(this.props.instance);
      },

      onDelete: function(){
        actions.InstanceActions.terminate({
          instance:this.props.instance,
          project: this.props.project
        });
      },

      render: function () {
        var instance = this.props.instance,
            status = instance.get('state').get('status'),
            linksArray = [];

        if(instance.get('state').isInFinalState()) {
          if (status === "active") {
            linksArray.push(
              <Button icon="pause"
                    tooltip="Suspend"
                    onClick={this.onSuspend}
                    isVisible={true}
              />
            );
            linksArray.push(
              <Button icon="stop"
                    tooltip="Stop"
                    onClick={this.onStop}
                    isVisible={true}
              />
            );
          } else if (status === "suspended") {
            linksArray.push(
              <Button icon="play"
                    tooltip="Resume"
                    onClick={this.onResume}
                    isVisible={true}
              />
            );
          } else if (status === "shutoff") {
            linksArray.push(
              <Button icon="play"
                    tooltip="Start"
                    onClick={this.onStart}
                    isVisible={true}
              />
            );
          }
        }

        linksArray.push(
          <Button icon="remove"
                    tooltip="Delete"
                    onClick={this.onDelete}
                    isVisible={true}
          />
        );

        return (
          <div style={{"border-left": "1px solid #ddd", "display": "inline-block", "padding-left": "10px", "float": "right"}}>
            {linksArray}
          </div>
        );
      }

    });

  });
