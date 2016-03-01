import React from 'react';
import Backbone from 'backbone';
import BreadcrumbBar from 'components/projects/common/BreadcrumbBar.react';
import InstanceInfoSection from './sections/InstanceInfoSection.react';
import InstanceDetailsSection from './sections/InstanceDetailsSection.react';
import InstanceMetricsSection from './sections/InstanceMetricsSection.react';
import InstanceActionsAndLinks from './actions/InstanceActionsAndLinks.react';
import stores from 'stores';

export default React.createClass({
    displayName: "InstanceDetailsView",

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
