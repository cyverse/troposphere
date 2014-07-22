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
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
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
        var requestImageUrl = URL.requestImage({
          project: this.props.project,
          instance: this.props.instance
        }, {absolute: true});

        var reportInstanceUrl = URL.reportInstance({
          project: this.props.project,
          instance: this.props.instance
        }, {absolute: true});

        var webShellUrl = this.props.instance.get('shell_url');
        var remoteDesktopUrl = this.props.instance.get('vnc_url');

        var status = this.props.instance.get('status');

        // todo: Add back and implement reboot and resize once it's understood how to
        // I'm hiding from the display for now so as not to show users functionality
        // that doesn't exist.
        var linksArray = [
          {label: 'Actions', icon: null},
          {label: 'Image', icon: 'camera', href: requestImageUrl},
          {label: 'Report', icon: 'inbox', href: reportInstanceUrl}
          //{label: 'Reboot', icon: 'repeat', onClick: this.onReboot},
          //{label: 'Resize', icon: 'resize-full', onClick: this.onResize},
        ];

        // Add in the conditional links based on current machine state
        if(status === "active"){
          linksArray.push({label: 'Suspend', icon: 'pause', onClick: this.onSuspend});
          linksArray.push({label: 'Stop', icon: 'stop', onClick: this.onStop});
        }else if(status === "suspended"){
          linksArray.push({label: 'Resume', icon: 'play', onClick: this.onResume});
        }else if(status === "shutoff"){
          linksArray.push({label: 'Start', icon: 'play', onClick: this.onStart});
        }

        linksArray = linksArray.concat([
          {label: 'Terminate', icon: 'remove', onClick: this.onTerminate, isDangerLink: true},
          {label: 'Links', icon: null},
          {label: 'Open Web Shell', icon: 'credit-card', href: webShellUrl, openInNewWindow: true},
          {label: 'Remote Desktop', icon: 'fullscreen', href: remoteDesktopUrl, openInNewWindow: true}
        ]);

        var links = linksArray.map(function(link){
          // Links without icons are generally section headings
          if(!link.icon) return (
            <li className="section-label">{link.label}</li>
          );

          var className = "section-link";
          if(link.isDangerLink) className += " danger";
          // todo: This isn't implemented well at all.  We should be disabling these
          // buttons if there isn't a valid href for the link, or (perhaps) not even
          // showing the buttons at all...but I think it's better communication to
          // disable the buttons with a message explaining why on rollover.
          //
          if(link.openInNewWindow) {
            var style = {};
            if(!link.href) style.cursor = 'not-allowed';
            return (
              <li className={className} style={style}>
                <a href={link.href} target="_blank">
                  <span>
                    <Glyphicon name={link.icon}/>{link.label}
                  </span>
                </a>
              </li>
            );
          }

          // Some actions have hrefs, because they redirect to actual pages (and are
          // not actions in need of confirmation).  While we *could* call
          // Backbone.history.navigate from an onClick callback, we want all url
          // changes to pass through our Backbone catcher in main.js that we can use
          // to log requests to Google Analytics
          if(link.href) return (
            <li className={className}>
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
            <li className={className} onClick={link.onClick}>
              <span>
                <Glyphicon name={link.icon}/>{link.label}
              </span>
            </li>
          );
        });

        return (
          <div className="resource-actions">
            <ul>
              {links}
            </ul>
          </div>

        );
      }

    });

  });
