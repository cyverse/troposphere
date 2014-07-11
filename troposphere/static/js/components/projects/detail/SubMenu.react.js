/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceTable.react',
    './VolumeTable.react',
    './PreviewPanel.react'
  ],
  function (React, Backbone, InstanceTable, VolumeTable, PreviewPanel) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <div className="sub-menu">
            <button className="btn btn-primary">Create</button>
            <ul>
              <li className="active"><a href="#">Instances</a></li>
              <li><a href="#">Volumes</a></li>
            </ul>
          </div>
        );
      }

    });

  });
