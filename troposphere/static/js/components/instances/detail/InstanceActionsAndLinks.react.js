/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react',
    'url',
    'actions/InstanceActions'
  ],
  function (React, Glyphicon, URL, InstanceActions) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onStart: function(){
        InstanceActions.start(this.props.instance);
      },

      onSuspend: function(){
        InstanceActions.suspend(this.props.instance);
      },

      onStop: function(){
        InstanceActions.stop(this.props.instance);
      },

      onResume: function(){
        InstanceActions.resume(this.props.instance);
      },

      onTerminate: function(){
        InstanceActions.terminate(this.props.instance);
      },

      onReboot: function(){ /* no implementation yet */ },
      onResize: function(){ /* no implementation yet */ },

      render: function () {
        var requestImageUrl = URL.requestImage(this.props.instance, {absolute: true});
        var reportInstanceUrl = URL.reportInstance(this.props.instance, {absolute: true});

        var webShellUrl = this.props.instance.get('shell_url');
        var remoteDesktopUrl = this.props.instance.get('vnc_url');

        var linksArray = [
          {label: 'Actions', icon: null},
          {label: 'Image', icon: 'camera', href: requestImageUrl},
          {label: 'Report', icon: 'inbox', href: reportInstanceUrl},
          {label: 'Reboot', icon: 'repeat', onClick: this.onReboot},
          {label: 'Suspend', icon: 'pause', onClick: this.onSuspend},
          {label: 'Start', icon: 'play', onClick: this.onStart},
          {label: 'Resume', icon: 'play', onClick: this.onResume},
          {label: 'Stop', icon: 'stop', onClick: this.onStop},
          {label: 'Resize', icon: 'resize-full', onClick: this.onResize},
          {label: 'Terminate', icon: 'remove', onClick: this.onTerminate},
          {label: 'Links', icon: null},
          {label: 'Open Web Shell', icon: 'credit-card', href: webShellUrl, openInNewWindow: true},
          {label: 'Remote Desktop', icon: 'fullscreen', href: remoteDesktopUrl, openInNewWindow: true}
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

          // todo: This isn't implemented well at all.  We should be disabling these
          // buttons if there isn't a valid href for the link, or (perhaps) not even
          // showing the buttons at all...but I think it's better communication to
          // disable the buttons with a message explaining why on rollover.
          //
          if(link.openInNewWindow) {
            var style = {};
            if(!link.href) style.cursor = 'not-allowed';
            return (
              <li className="action-link" style={style}>
                <a href={link.href} target="_blank">
                  <span>
                    <Glyphicon name={link.icon}/>{link.label}
                  </span>
                </a>
              </li>
            );
          }

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
