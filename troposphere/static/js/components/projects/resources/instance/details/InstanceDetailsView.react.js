import React from 'react';
import Backbone from 'backbone';

import stores from 'stores';
import BreadcrumbBar from 'components/projects/common/BreadcrumbBar.react';
import InstanceInfoSection from './sections/InstanceInfoSection.react';
import InstanceDetailsSection from './sections/InstanceDetailsSection.react';
import InstanceMetricsSection from './sections/InstanceMetricsSection.react';
import AllocationSourceSection from './sections/AllocationSourceSection.react';
import InstanceActionsAndLinks from './actions/InstanceActionsAndLinks.react';
import EventActions from "actions/EventActions";
import EventTypes from "constants/EventConstants";

export default React.createClass({
    displayName: "InstanceDetailsView",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
    

    onSourceChange(source) {
        let instance = this.props.instance;
        EventActions.fire(
            EventTypes.ALLOCATION_SOURCE_CHANGE,
            instance.get('user').username,
            {
                allocation_source_id: source.get('source_id'),
                instance_id: instance.get("uuid")
            }
        )
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

        // TODO:
        let renderAllocationSource = true ?
            <AllocationSourceSection onSourceChange={ this.onSourceChange } /> : null;

        return (
            <div>
                <BreadcrumbBar breadcrumbs={breadcrumbs}/>

                <div className="row resource-details-content">
                    <div className="col-md-9">
                        <InstanceInfoSection instance={instance}/>
                        <hr/>
                        { renderAllocationSource }
                        <InstanceDetailsSection instance={instance}/>
                        <hr/>
                        {
                            show_instance_metrics
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
