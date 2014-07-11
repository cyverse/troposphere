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
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        return (
          <div>
            <div className="header">
              <i className="glyphicon glyphicon-hdd"></i>
              <h2>Volumes</h2>
            </div>
            <table className="table">
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
                <VolumeRow/>
                <VolumeRow/>
              </tbody>
            </table>
          </div>
        );
      }

    });

  });
