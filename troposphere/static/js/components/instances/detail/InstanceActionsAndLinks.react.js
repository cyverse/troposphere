/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react'
  ],
  function (React, Glyphicon) {

    return React.createClass({

      render: function () {
        var linksArray = [
          {label: 'Actions', icon: null},
          {label: 'Image', icon: 'camera'},
          {label: 'Report', icon: 'inbox'},
          {label: 'Reboot', icon: 'repeat'},
          {label: 'Suspend', icon: 'pause'},
          {label: 'Stop', icon: 'stop'},
          {label: 'Resize', icon: 'resize-full'},
          {label: 'Terminate', icon: 'remove'},
          {label: 'Links', icon: null},
          {label: 'Open Web Shell', icon: 'credit-card'},
          {label: 'Remote Desktop', icon: 'fullscreen'}
        ];

        var links = linksArray.map(function(link){
          if(!link.icon) return (
            <li className="action-section">{link.label}</li>
          );

          return (
            <li>
              <span>
                <Glyphicon name={link.icon}/>{link.label}
              </span>
            </li>
          );
        });

        return (
          <div className="instance-actions">
            <ul>
              {links}
            </ul>
          </div>

        );
      }

    });

  });
