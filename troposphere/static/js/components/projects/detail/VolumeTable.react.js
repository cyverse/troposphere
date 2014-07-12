/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './VolumeRow.react'
  ],
  function (React, Backbone, VolumeRow) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
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
                  <th><div className="resource-checkbox"></div></th>
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
