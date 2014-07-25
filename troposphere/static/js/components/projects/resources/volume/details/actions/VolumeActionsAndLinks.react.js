/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react',
    'url',
    'actions/VolumeActions'
  ],
  function (React, Glyphicon, URL, VolumeActions) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onAttach: function(){
        VolumeActions.attach(this.props.volume);
      },

      onDetach: function(){
        VolumeActions.detach(this.props.volume);
      },

      onDelete: function(){
        VolumeActions.destroy(this.props.volume);
      },

      render: function () {

        var status = this.props.volume.get('status');

        var linksArray = [
          {label: 'Actions', icon: null}
        ];

        // Add in the conditional links based on current machine state
        if(status === "available"){
          linksArray.push({label: 'Attach', icon: 'save', onClick: this.onAttach});
        }else if(status === "in-use"){
          linksArray.push({label: 'Detach', icon: 'open', onClick: this.onDetach});
        }

        linksArray = linksArray.concat([
          {label: 'Delete', icon: 'remove', onClick: this.onDelete, isDangerLink: true}
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
              <li className={className + " link"} style={style}>
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
            <li className={className + " link"}>
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
