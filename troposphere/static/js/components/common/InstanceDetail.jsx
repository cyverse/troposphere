import React from "react";

import subscribe from "utilities/subscribe";
import globals from "globals";
import context from "context";

import AllocationSourceSection from "components/projects/resources/instance/details/sections/AllocationSourceSection";
import InstanceDetailsSection from "components/projects/resources/instance/details/sections/InstanceDetailsSection";
import PastInstanceDetailsSection from "components/projects/resources/instance/details/sections/PastInstanceDetailsSection";
import InstanceActionsAndLinks from "components/projects/resources/instance/details/actions/InstanceActionsAndLinks";
import InstanceMetricsSection from "components/projects/resources/instance/details/sections/InstanceMetricsSection";
import InstanceInfoSection from "components/projects/resources/instance/details/sections/InstanceInfoSection";
import InstanceHistorySection from "components/common/InstanceHistorySection";


const InstanceDetail = React.createClass({
    displayName: "InstanceDetail",

    propTypes: {
        params: React.PropTypes.object
    },

    onNewData: function() { this.forceUpdate(); },

    renderAllocationSourceSection() {
        let instance = this.props.params,
            instance_username = instance.get('user').username,
            current_username = context.profile.get('username'),
            disabled = (current_username != instance_username);
        let props = {
            disabled: disabled,
            instance,
            ...this.props
        }
        return (
        <AllocationSourceSection { ...props }/>
        );
    },


    renderInactiveInstance: function(history) {
        let { InstanceStore } = this.props.subscriptions;
        var instanceHistory = history.first(),
            instance = instanceHistory.get('instance'),
            instanceObj = InstanceStore.fetchOne(instance.id, {
                archived: true,
            });

        if(!instanceObj) {
            return <div className="loading" />
        }

        var metrics = globals.SHOW_INSTANCE_METRICS
            ? <InstanceMetricsSection instance={instanceObj} />
            : "";

        return (
            <div className="row resource-details-instanceDetailsSection">
                <div className="col-md-9">
                    <InstanceInfoSection instance={instanceObj} />
                    <hr />
                    <PastInstanceDetailsSection instance={instanceObj} />
                    <hr/>
                    {metrics}
                    <hr/>
                    <InstanceHistorySection instance={instanceObj} />
                </div>
            </div>
        );
    },

    renderActiveInstance: function(instance) {
        let { ProjectStore } = this.props.subscriptions;
        var metricsSection = globals.SHOW_INSTANCE_METRICS
            ? <InstanceMetricsSection instance={instance} />
            : null;
        var allocationSourceSection = globals.USE_ALLOCATION_SOURCES
            ? this.renderAllocationSourceSection()
            : null;
        let project = ProjectStore.get(instance.get('project').id);
        if (!project) {
            return (<div className="loading" />);
        }

        return (
            <div className="row resource-details-instanceDetailsSection">
                <div className="col-md-9">
                    <InstanceInfoSection instance={instance} />
                    <hr/>
                    {allocationSourceSection}
                    <InstanceDetailsSection instance={instance} />
                    <hr/>
                    {metricsSection}
                    <hr/>
                    <InstanceHistorySection instance={instance} />
                </div>
                <div className="col-md-3">
                    <InstanceActionsAndLinks project={project} instance={instance} />
                </div>
            </div>
        );
    },

    render: function() {
        let { params } = this.props;
        let { InstanceStore, InstanceHistoryStore } = this.props.subscriptions;
        let instances = InstanceStore.getAll();
        let instance = instances && instances.get(params.id);
        let history = InstanceHistoryStore.fetchWhere({
            "instance": params.id
        })
        if (!history || !instances) {
            return <div className="loading" />
        }

        // If we got back active instances, but the instance isn't a member
        let instanceDetailsSection;
        if (!instance) {
            instanceDetailsSection = this.renderInactiveInstance(history);
        } else {
            instanceDetailsSection = this.renderActiveInstance(instance);
        }

        return (
            <div className="container">
                {instanceDetailsSection}
            </div>
        );
    },

});

export default subscribe(InstanceDetail, ["ProjectStore", "ImageStore", "InstanceStore", "InstanceHistoryStore"]);
