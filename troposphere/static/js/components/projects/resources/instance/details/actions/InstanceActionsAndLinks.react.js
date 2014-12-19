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

      onReport: function(){
        InstanceActions.reportInstance(this.props.instance);
      },

      onDelete: function(){
        var redirectUrl = URL.projectResources(this.props.project, {relative: true});
        InstanceActions.terminate({
          instance:this.props.instance,
          project: this.props.project,
          redirectUrl: redirectUrl
        });
      },

      onReboot: function(){
        InstanceActions.reboot(this.props.instance);
      },

      render: function () {
        var requestImageUrl = URL.requestImage({
          project: this.props.project,
          instance: this.props.instance
        });

        var webShellUrl = this.props.instance.get('shell_url');
        var remoteDesktopUrl = this.props.instance.get('vnc_url');

        var status = this.props.instance.get('state').get('status');

        // todo: Add back and implement reboot and resize once it's understood how to
        // I'm hiding from the display for now so as not to show users functionality
        // that doesn't exist.
        var linksArray = [
          {label: 'Actions', icon: null},
          {label: 'Report', icon: 'inbox', onClick: this.onReport}
          //{label: 'Reboot', icon: 'repeat', onClick: this.onReboot},
          //{label: 'Resize', icon: 'resize-full', onClick: this.onResize},
        ];

        if(status !== "suspended"){
          linksArray.push({label: 'Image', icon: 'camera', href: requestImageUrl});
        }

        // Add in the conditional links based on current machine state
        if(this.props.instance.get('state').isInFinalState()) {
          if (status === "active") {
            linksArray.push({label: 'Suspend', icon: 'pause', onClick: this.onSuspend});
            linksArray.push({label: 'Stop', icon: 'stop', onClick: this.onStop});
            linksArray.push({label: 'Reboot', icon: 'repeat', onClick: this.onReboot});
          } else if (status === "suspended") {
            linksArray.push({label: 'Resume', icon: 'play', onClick: this.onResume});
          } else if (status === "shutoff") {
            linksArray.push({label: 'Start', icon: 'play', onClick: this.onStart});
          }
        }

        linksArray = linksArray.concat([
          {label: 'Delete', icon: 'remove', onClick: this.onDelete, isDangerLink: true},
          {label: 'Links', icon: null},
          {label: 'Open Web Shell', icon: 'credit-card', href: webShellUrl, openInNewWindow: true},
          {label: 'Remote Desktop', icon: 'fullscreen', href: remoteDesktopUrl, openInNewWindow: true}
        ]);

        var links = linksArray.map(function(link){
          // Links without icons are generally section headings
          if(!link.icon) return (
            <li key={link.label} className="section-label">{link.label}</li>
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
              <li key={link.label} className={className + " link"} style={style}>
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
            <li key={link.label} className={className + " link"}>
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
            <li key={link.label} className={className} onClick={link.onClick}>
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
