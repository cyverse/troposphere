define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Glyphicon = require('components/common/Glyphicon.react'),
    modals = require('modals'),
    actions = require('actions');

  return React.createClass({

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onAttach: function () {
      modals.InstanceVolumeModals.attach(this.props.volume, this.props.project);
    },

    onDetach: function () {
      modals.InstanceVolumeModals.detach(this.props.volume);
    },

    onDelete: function () {
      var project = this.props.project,
        volume = this.props.volume;

      modals.VolumeModals.destroy({
        volume: this.props.volume,
        project: this.props.project
      });
    },

    handleReport: function () {
      modals.VolumeModals.report({volume: this.props.volume});
    },

    render: function () {
      var volume = this.props.volume,
        status = volume.get('state').get('status');

      var linksArray = [
        {label: 'Actions', icon: null},
        {label: 'Report', icon: 'inbox', onClick: this.handleReport}
      ];

      // Add in the conditional links based on current machine state
      if (status === "available") {
        linksArray.push({label: 'Attach', icon: 'save', onClick: this.onAttach});
      } else if (status === "in-use") {
        linksArray.push({label: 'Detach', icon: 'open', onClick: this.onDetach});
      }

      linksArray = linksArray.concat([
        {label: 'Delete', icon: 'remove', onClick: this.onDelete, isDangerLink: true}
      ]);

      var links = linksArray.map(function (link) {
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
