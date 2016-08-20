import React from "react";
import Backbone from "backbone";

import BreadcrumbBar from "components/projects/common/BreadcrumbBar.react";
import globals from "globals";
import stores from "stores";
import Utils from "actions/Utils";
import InstanceInfoSection from "./sections/InstanceInfoSection.react";
import InstanceDetailsSection from "./sections/InstanceDetailsSection.react";
import InstanceMetricsSection from "./sections/InstanceMetricsSection.react";
import AllocationSourceSection from "./sections/AllocationSourceSection.react";
import InstanceActionsAndLinks from "./actions/InstanceActionsAndLinks.react";
import EventActions from "actions/EventActions";
import EventConstants from "constants/EventConstants";

export default React.createClass({
    displayName: "InstanceDetailsView",

    propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        allocationSources: React.PropTypes.instanceOf(Backbone.Collection),
    },

    onSourceChange(allocationSource) {
        let instance = this.props.instance;
        EventActions.fire(
            EventConstants.ALLOCATION_SOURCE_CHANGE,
            { instance, allocationSource }
        );
        // force update the associated allocation source prior to update
        instance.set({allocation_source: allocationSource});
        Utils.dispatch(
            EventConstants.ALLOCATION_SOURCE_CHANGE,
            { instance, allocationSource }
        );
        //stores.InstanceStore.update(instance);
    },

    renderAllocationSourceSection() {
        let props = {
            onSourceChange: this.onSourceChange,
            ...this.props
        }
        return (
        <AllocationSourceSection { ...props }/>
        );
    },

    render() {
        let { instance, project }  = this.props;

        var breadcrumbs = [
            {
                name: "Resources",
                linksTo: "project-resources",
                params: {
                    projectId: project.id
                }
            },
            {
                name: instance.get("name"),
                linksTo: "project-instance-details",
                params: {
                    projectId: project.id,
                    instanceId: instance.id
                }
            }
        ];

        return (
        <div>
            <BreadcrumbBar breadcrumbs={breadcrumbs}/>
            <div className="row resource-details-content">
                <div className="col-md-9">
                    <InstanceInfoSection instance={instance}/>
                    <hr/>
                    {
                        globals.USE_ALLOCATION_SOURCES
                        ? this.renderAllocationSourceSection()
                        : null
                    }
                    <InstanceDetailsSection instance={instance} />
                    <hr/>
                    {
                        globals.SHOW_INSTANCE_METRICS
                        ? <InstanceMetricsSection instance={instance} />
                        : ""
                    }
                </div>
                <div className="col-md-3">
                    <InstanceActionsAndLinks project={project} instance={instance} />
                </div>
            </div>
        </div>
        );
    }
});
