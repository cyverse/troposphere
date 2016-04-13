define(function(require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Glyphicon = require('components/common/Glyphicon.react'),
    actions = require('actions'),
    modals = require('modals');

  return React.createClass({
    displayName: "InstanceActionsAndLinks",

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onStart: function() {
      modals.InstanceModals.start(this.props.instance);
    },

    onSuspend: function() {
      modals.InstanceModals.suspend(this.props.instance);
    },

    onStop: function() {
      modals.InstanceModals.stop(this.props.instance);
    },

    onResume: function() {
      modals.InstanceModals.resume(this.props.instance);
    },

    onReport: function() {
      modals.InstanceModals.report({
        instance: this.props.instance
      });
    },

    onImageRequest: function() {
      modals.InstanceModals.requestImage({
        instance: this.props.instance
      });
    },

    onDelete: function() {
      var instance = this.props.instance,
          project;

      if(this.props.project){
        project = this.props.project;
      }

      modals.InstanceModals.destroy({
        instance: instance,
        project: project,
        linksTo: "project-resources"
      });
    },

    onRedeploy: function(){
      modals.InstanceModals.redeploy(this.props.instance);
    },

    onReboot: function(){
      modals.InstanceModals.reboot(this.props.instance);
    },

    render: function() {
      var webShellUrl = this.props.instance.shell_url(),
          remoteDesktopUrl = this.props.instance.vnc_url(),
          usesRemoteDesktop = !!(this.props.instance && this.props.instance.get('vnc')),
          status = this.props.instance.get('state').get('status'),
          activity = this.props.instance.get('state').get('activity'),
          ip_address = this.props.instance.get('ip_address'),
          webLinksDisabled = !ip_address || ip_address === "0.0.0.0",
          inFinalState = this.props.instance.get('state').isInFinalState();

      // todo: Add back and implement reboot and resize once it's understood how to
      // I'm hiding from the display for now so as not to show users functionality
      // that doesn't exist.
      var linksArray = [
        {label: 'Actions', icon: null},
        {label: 'Report', icon: 'inbox', onClick: this.onReport}
        //{label: 'Reboot', icon: 'repeat', onClick: this.onReboot},
        //{label: 'Resize', icon: 'resize-full', onClick: this.onResize},
      ];

      if (status !== "suspended") {
        linksArray.push({label: 'Image', icon: 'camera', onClick: this.onImageRequest});
      }

      // Add in the conditional links based on current machine state
      if (inFinalState) {
        if (status === "active") {
          linksArray.push({label: 'Suspend', icon: 'pause', onClick: this.onSuspend});
          linksArray.push({label: 'Stop', icon: 'stop', onClick: this.onStop});
          linksArray.push({label: 'Reboot', icon: 'repeat', onClick: this.onReboot});
          linksArray.push({label: 'Redeploy', icon: 'repeat', onClick: this.onRedeploy});
        } else if (status === "suspended") {
          linksArray.push({label: 'Resume', icon: 'play', onClick: this.onResume});
          linksArray.push({label: 'Reboot', icon: 'repeat', onClick: this.onReboot});
        } else if (status === "shutoff") {
          linksArray.push({label: 'Start', icon: 'play', onClick: this.onStart});
        }
      }

      if ( activity === "deploying" || status === "deploying"
        || activity === "deploy_error"|| status === "deploy_error"
        || activity === "initializing" || activity === "boot_script_error") {
        linksArray.push({label: 'Redeploy', icon: 'repeat', onClick: this.onRedeploy});
      }

      if (!inFinalState && status === "active" && activity === "networking") {
          linksArray.push({label: 'Reboot', icon: 'repeat', onClick: this.onReboot});
          linksArray.push({label: 'Redeploy', icon: 'repeat', onClick: this.onRedeploy});
      }
      linksArray = linksArray.concat([
        {label: 'Delete', icon: 'remove', onClick: this.onDelete, isDangerLink: true},
        {label: 'Links', icon: null},
        {
          label: 'Open Web Shell',
          icon: 'console',
          href: webShellUrl,
          openInNewWindow: true,
          isDisabled: webLinksDisabled
        }
      ]);

      if (usesRemoteDesktop) {
        linksArray = linksArray.concat([
                {
          label: 'Remote Desktop',
          icon: 'sound-stereo',
          href: remoteDesktopUrl,
          openInNewWindow: true,
          isDisabled: webLinksDisabled
        }]);
      }

      var links = linksArray.map(function(link) {
        // Links without icons are generally section headings
        if (!link.icon) return (
          <li key={link.label} className="section-label">{link.label}</li>
        );

        var className = "section-link";
        if (link.isDangerLink) className += " danger";
        // todo: This isn't implemented well at all.  We should be disabling these
        // buttons if there isn't a valid href for the link, or (perhaps) not even
        // showing the buttons at all...but I think it's better communication to
        // disable the buttons with a message explaining why on rollover.
        //
        if (link.openInNewWindow) {
          var style = {};
          if (!link.href) style.cursor = 'not-allowed';
          return (
            <li key={link.label} className={className + " link"} style={style} disabled={link.isDisabled}>
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
        if (link.href) return (
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
