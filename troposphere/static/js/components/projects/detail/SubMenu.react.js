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
                  <a href="/application/images">
                    <i className={'glyphicon glyphicon-tasks'}/>
                    Instance
                  </a>
                </li>
                <li>
                  <a href="#" onClick={this.onLaunchVolume}>
                    <i className={'glyphicon glyphicon-hdd'}/>
                    Volume
                  </a>
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
