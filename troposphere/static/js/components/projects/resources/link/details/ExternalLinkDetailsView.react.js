define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    ExternalLinkInfoSection = require('./sections/ExternalLinkInfoSection.react'),
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
          </div>
        </div>
      );
    }

  });

});

