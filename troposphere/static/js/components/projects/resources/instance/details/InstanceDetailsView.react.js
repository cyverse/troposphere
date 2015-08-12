define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    BreadcrumbBar = require('components/projects/common/BreadcrumbBar.react'),
    InstanceInfoSection = require('./sections/InstanceInfoSection.react'),
    InstanceDetailsSection = require('./sections/InstanceDetailsSection.react'),
    InstanceMetricsSection = require('./sections/InstanceMetricsSection.react'),
    InstanceActionsAndLinks = require('./actions/InstanceActionsAndLinks.react'),
    stores = require('stores');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var instance = this.props.instance,
        project = this.props.project;

      if (!instance || !project) return <div className="loading"></div>;

      var breadcrumbs = [
        {
          name: "Resources",
          linksTo: "project-resources",
          params: {projectId: project.id}
        },
        {
          name: instance.get('name'),
          linksTo: "project-instance-details",
          params: {projectId: project.id, instanceId: instance.id}
        }
      ];

      return (
        <div>
          <BreadcrumbBar breadcrumbs={breadcrumbs}/>

          <div className="row resource-details-content">
            <div className="col-md-9">
              <InstanceInfoSection instance={instance}/>
              <hr/>
              <InstanceDetailsSection instance={instance}/>
              <hr/>
              { 
                typeof show_instance_metrics != "undefined" 
                ? <InstanceMetricsSection instance={instance}/> 
                : ""
              }
            </div>
            <div className="col-md-3">
              <InstanceActionsAndLinks
                project={project}
                instance={instance}
                />
            </div>
          </div>
        </div>
      );
    }

  });

});
