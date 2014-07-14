/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceTable.react',
    './VolumeTable.react',
    './PreviewPanel.react',
    'actions/VolumeActions'
  ],
  function (React, Backbone, InstanceTable, VolumeTable, PreviewPanel, VolumeActions) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onLaunchVolume: function(e){
        e.preventDefault();
        VolumeActions.createAndAddToProject(this.props.project);
      },

      render: function () {
        return (
          <div className="sub-menu">
            <div className="dropdown">
              <button className="btn btn-primary dropdown-toggle" data-toggle="dropdown">Create</button>
              <ul className="dropdown-menu">
                <li>
                  <i className={'glyphicon glyphicon-tasks'}/>
                  <a href="/application/images">Instance</a>
                </li>
                <li>
                  <i className={'glyphicon glyphicon-hdd'}/>
                  <a href="#" onClick={this.onLaunchVolume}>Volume</a>
                </li>
              </ul>
            </div>
            <ul>
              <li className="active"><a href="#">Instances</a></li>
              <li><a href="#">Volumes</a></li>
            </ul>
          </div>
        );
      }

    });

  });
