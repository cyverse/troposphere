define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Glyphicon = require('components/common/Glyphicon.react'),
    modals = require('modals'),
    actions = require('actions');

  return React.createClass({
    displayName: "ExternalLinkActions",

    propTypes: {
      link: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onDelete: function () {
      var project = this.props.project,
        link = this.props.link;

      modals.ExternalLinkModals.destroy({
        link: this.props.link,
        project: this.props.project
      });
    },

    handleReport: function () {
      modals.ExternalLinkModals.report({link: this.props.link});
    },

    render: function () {
      var link = this.props.link;
      var linksArray = [
        {label: 'Actions', icon: null},
        {label: 'Go To Link', icon: 'globe', target:"_blank", href: link.get('link'), onClick: this.handleReport}
      ];
      //DEVNOTE: The 'links' referenced in the comments below are related to the general component of 'LinkActions' and not 'ExternalLink' models.
      // Add in the conditional links based on current machine state
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

        // Some actions have hrefs, because they redirect to actual pages (and are
        // not actions in need of confirmation).  While we *could* call
        // Backbone.history.navigate from an onClick callback, we want all url
        // changes to pass through our Backbone catcher in main.js that we can use
        // to log requests to Google Analytics
        if (link.href) return (
          <li key={link.label} className={className + " link"}>
            <a href={link.href} target={link.target ? link.target : "_self"}>
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
