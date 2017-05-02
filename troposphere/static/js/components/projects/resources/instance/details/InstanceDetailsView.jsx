import React from "react";
import Backbone from "backbone";

import BreadcrumbBar from "components/projects/common/BreadcrumbBar";
import globals from "globals";
import Utils from "actions/Utils";
import InstanceInfoSection from "./sections/InstanceInfoSection";
import InstanceDetailsSection from "./sections/InstanceDetailsSection";
import InstanceMetricsSection from "./sections/InstanceMetricsSection";
import AllocationSourceSection from "./sections/AllocationSourceSection";
import InstanceActionsAndLinks from "./actions/InstanceActionsAndLinks";

export default React.createClass({
    displayName: "InstanceDetailsView",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        allocationSources: React.PropTypes.instanceOf(Backbone.Collection),
    },

    render() {
        let { instance, project } = this.props;

        var breadcrumbs = [
            {
                name: "Resources",
                linksTo: `/projects/${project.id}/resources`,
                params: {
                    projectId: project.id
                }
            },
            {
                name: instance.get("name"),
                linksTo: `projects/${project.id}/instances/${instance.id}`,
                params: {
                    projectId: project.id,
                    instanceId: instance.id
                }
            }
        ];

        return (
        <div>
            <BreadcrumbBar breadcrumbs={breadcrumbs} />
            <div className="row resource-details-content">
                <div className="col-md-9">
                    <InstanceInfoSection instance={instance} />
                    <hr/>
                    <AllocationSourceSection { ...this.props }/>
                    <InstanceDetailsSection instance={instance} />
                    <hr/>
                    {globals.SHOW_INSTANCE_METRICS
                     ? <InstanceMetricsSection instance={instance} />
                     : ""}
                </div>
                <div className="col-md-3">
                    <InstanceActionsAndLinks project={project}
                                             instance={instance} />
                </div>
            </div>
        </div>
        );
    }
});
