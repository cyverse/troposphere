/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react',
    'controllers/InstanceController',
    'url'
  ],
  function (React, Glyphicon, InstanceController, URL) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onPlay: function(){
        InstanceController.start(this.props.instance);
      },

      onSuspend: function(){
        InstanceController.suspend(this.props.instance);
      },

      onStop: function(){
        InstanceController.stop(this.props.instance);
      },

      onResume: function(){
        InstanceController.resume(this.props.instance);
      },

      onTerminate: function(){
        InstanceController.terminate(this.props.instance);
      },

      onReboot: function(){ },
      onResize: function(){ },
      onOpenWebShell: function(){ },
      onRemoteDesktop: function(){ },

      render: function () {
        var requestImageUrl = URL.requestImage(this.props.instance, {absolute: true});
        var reportInstanceUrl = URL.reportInstance(this.props.instance, {absolute: true});

        var linksArray = [
          {label: 'Actions', icon: null},
          {label: 'Image', icon: 'camera', href: requestImageUrl},
          {label: 'Report', icon: 'inbox', href: reportInstanceUrl},
          {label: 'Reboot', icon: 'repeat', onClick: this.onReboot},
          {label: 'Suspend', icon: 'pause', onClick: this.onSuspend},
          {label: 'Start', icon: 'play', onClick: this.onPlay},
          {label: 'Resume', icon: 'play', onClick: this.onResume},
          {label: 'Stop', icon: 'stop', onClick: this.onStop},
          {label: 'Resize', icon: 'resize-full', onClick: this.onResize},
          {label: 'Terminate', icon: 'remove', onClick: this.onTerminate},
          {label: 'Links', icon: null},
          {label: 'Open Web Shell', icon: 'credit-card', onClick: this.onOpenWebShell},
          {label: 'Remote Desktop', icon: 'fullscreen', onClick: this.onRemoteDesktop}
        ];

        var links = linksArray.map(function(link){
          // Links without icons are generally section headings
          if(!link.icon) return (
            <li className="action-section">{link.label}</li>
          );

          // Some actions have hrefs, because they redirect to actual pages (and are
          // not actions in need of confirmation).  While we *could* call
          // Backbone.history.navigate from an onClick callback, we want all url
          // changes to pass through our Backbone catcher in main.js that we can use
          // to log requests to Google Analytics
          if(link.href) return (
            <li className="action-link">
              <a href={link.href}>
              <span>
                <Glyphicon name={link.icon}/>{link.label}
              </span>
              </a>
            </li>
          );

          // Links with onClick callbacks will typically trigger modals requiring
          // confirmation before continuing
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
