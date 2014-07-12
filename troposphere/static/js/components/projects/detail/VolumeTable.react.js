/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './VolumeRow.react',
    './Checkbox.react'
  ],
  function (React, Backbone, VolumeRow, Checkbox) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
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
          return (
            <VolumeRow key={volume.id}
                       volume={volume}
                       project={this.props.project}
                       onResourceSelected={this.props.onResourceSelected}
            />
          );
        }.bind(this));

        return (
          <div>
            <div className="header">
              <i className="glyphicon glyphicon-hdd"></i>
              <h2>Volumes</h2>
            </div>
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
          </div>
        );
      }

    });

  });
