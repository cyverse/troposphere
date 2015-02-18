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
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onAttach: function(){
        actions.VolumeActions.attach(this.props.volume, this.props.project);
      },

      onDetach: function(){
        actions.VolumeActions.detach(this.props.volume);
      },

      onDelete: function(){
        actions.VolumeActions.destroy({
          volume: this.props.volume,
          project: this.props.project
        });
      },

      render: function () {
        var volume = this.props.volume,
            status = volume.get('state').get('status'),
            linksArray = [];

        // Add in the conditional links based on current machine state
        if(status === "available"){
          linksArray.push(
            <Button icon="save"
                    tooltip="Attach"
                    onClick={this.onAttach}
                    isVisible={true}
            />
          );
        }else if(status === "in-use"){
          linksArray.push(
            <Button icon="open"
                    tooltip="Detach"
                    onClick={this.onDetach}
                    isVisible={true}
            />
          );
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
