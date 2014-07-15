/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './VolumeRow.react',
    './VolumeNotRealRow.react',
    './Checkbox.react'
  ],
  function (React, Backbone, VolumeRow, VolumeNotRealRow, Checkbox) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        selectedResource: React.PropTypes.instanceOf(Backbone.Model)
      },

      getInitialState: function(){
        return {
          isChecked: false
        }
      },

      toggleCheckbox: function(e){
        this.setState({isChecked: !this.state.isChecked});
      },

      render: function () {
        var volumeRows = this.props.volumes.map(function(volume){
          var isSelected = (this.props.selectedResource === volume);
          if(volume.isRealVolume) {
            return (
              <VolumeRow key={volume.id}
                         volume={volume}
                         project={this.props.project}
                         onResourceSelected={this.props.onResourceSelected}
                         providers={this.props.providers}
                         isSelected={isSelected}
              />
            );
          }else{
            return (
              <VolumeNotRealRow key={volume.id}
                                volume={volume}
                                project={this.props.project}
              />
            );
          }
        }.bind(this));

        return (
          <table className="table table-hover">
            <thead>
              <tr>
                <th><Checkbox isChecked={this.state.isChecked} onToggleChecked={this.toggleCheckbox}/></th>
                <th>Name</th>
                <th>Status</th>
                <th>Size</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              {volumeRows}
            </tbody>
          </table>
        );
      }

    });

  });
