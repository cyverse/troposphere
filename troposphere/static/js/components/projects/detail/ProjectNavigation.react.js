/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceTable.react',
    './VolumeTable.react',
    './PreviewPanel.react',
    './SubMenu.react'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <div className="secondary-nav">
            <div className="container">
              <div className="project-name">
                <h1>{this.props.project.get('name')}</h1>
              </div>
              <ul className="secondary-nav-links">
                <li><a href="#">Overview</a></li>
                <li className="active"><a href="#">Resources</a></li>
                <li><a href="#">Activity</a></li>
              </ul>
            </div>
          </div>
        );
      }

    });

  });
