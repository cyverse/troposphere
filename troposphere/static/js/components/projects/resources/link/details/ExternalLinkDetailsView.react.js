define(function (require) {

  var React = require('react'),
    Backbone = require('backbone'),
    ExternalLinkInfoSection = require('./sections/ExternalLinkInfoSection.react'),
    ExternalLinkActions = require('./sections/ExternalLinkActions.react'),
    BreadcrumbBar = require('components/projects/common/BreadcrumbBar.react');

  return React.createClass({
    displayName: "ExternalLinkDetailsView",

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      link: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var project = this.props.project,
        link = this.props.link;

      var breadcrumbs = [
        {
          name: "Resources",
          linksTo: "project-resources",
          params: {projectId: project.id}
        },
        {
          name: link.get('title'),
          linksTo: "project-link-details",
          params: {projectId: project.id, linkId: link.id}
        }
      ];

      return (
        <div>
          <BreadcrumbBar breadcrumbs={breadcrumbs}/>

          <div className="row resource-details-content">
            <div className="col-md-9 resource-detail-sections">
              <ExternalLinkInfoSection link={link}/>
              <hr/>
            </div>
            <div className="col-md-3 resource-actions">
              <ExternalLinkActions link={link} project={project}/>
            </div>
          </div>
        </div>
      );
    }

  });

});

