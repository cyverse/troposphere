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
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onStart: function(){
        InstanceActions.start(this.props.volume);
      },

      onSuspend: function(){
        InstanceActions.suspend(this.props.volume);
      },

      onStop: function(){
        InstanceActions.stop(this.props.volume);
      },

      onResume: function(){
        InstanceActions.resume(this.props.volume);
      },

      onTerminate: function(){
        InstanceActions.terminate(this.props.volume);
      },

      render: function () {

        var linksArray = [
          {label: 'Actions', icon: null},
          {label: 'Image', icon: 'camera', href: "#"},
          {label: 'Report', icon: 'inbox', href: "#"}
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
          {label: 'Terminate', icon: 'remove', onClick: this.onTerminate, isDangerLink: true}
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
