/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react',
    'controllers/InstanceController'
  ],
  function (React, Glyphicon, InstanceController) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onPlay: function(){
        InstanceController.start(this.props.instance);
      },

      render: function () {
        var nullFoo = function(){};
        var linksArray = [
          {label: 'Actions', icon: null},
          {label: 'Image', icon: 'camera', onClick: nullFoo},
          {label: 'Report', icon: 'inbox', onClick: nullFoo},
          {label: 'Reboot', icon: 'repeat', onClick: nullFoo},
          {label: 'Suspend', icon: 'pause', onClick: nullFoo},
          {label: 'Start', icon: 'play', onClick: this.onPlay},
          {label: 'Stop', icon: 'stop', onClick: nullFoo},
          {label: 'Resize', icon: 'resize-full', onClick: nullFoo},
          {label: 'Terminate', icon: 'remove', onClick: nullFoo},
          {label: 'Links', icon: null},
          {label: 'Open Web Shell', icon: 'credit-card', onClick: nullFoo},
          {label: 'Remote Desktop', icon: 'fullscreen', onClick: nullFoo}
        ];

        var links = linksArray.map(function(link){
          if(!link.icon) return (
            <li className="action-section">{link.label}</li>
          );

          return (
            <li className="action-link" onClick={link.onClick}>
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
