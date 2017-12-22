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


function getInstanceObjectFrom(history, store) {
    let instanceHistory = history.first(),
        instance;

    if (instanceHistory) {
        let ih = instanceHistory.get('instance') || {};
        instance = store.fetchOne(ih.id, {
            archived: true,
        });
    }

    return instance;
}


const InstanceDetail = React.createClass({
    displayName: "InstanceDetail",

    propTypes: {
        params: React.PropTypes.object
    },

    onNewData: function() { this.forceUpdate(); },

    renderAllocationSourceSection(instance) {
        let instanceUsername = instance.get('user').username,
            currentUsername = context.profile.get('username');

        let props = {
            disabled: (currentUsername != instanceUsername),
            instance,
            ...this.props
        }

        return (
        <AllocationSourceSection { ...props }/>
        );
    },


    renderInactiveInstance: function(history) {
        let { InstanceStore } = this.props.subscriptions,
            instanceObj = getInstanceObjectFrom(
                history,
                InstanceStore
            );

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
            ? this.renderAllocationSourceSection(instance)
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
        let { instance } = this.props,
            { InstanceStore, InstanceHistoryStore } = this.props.subscriptions,
            instances = InstanceStore.getAll(),
            history = null;

        // if we are provided w/ an instance,
        // then fetch history using provided id in paramas
        if (!instance) {
            let { instanceId } = this.props.params;

            history = InstanceHistoryStore.fetchWhere({
                "instance": instanceId
            });
        } else {
            history = InstanceHistoryStore.fetchWhere({
                "instance": instance.id
            });
        }

        let requires = [instances, history];

        // Use truthy check to see if loaded
        let loaded = requires.every(r => Boolean(r));
        if (!loaded) {
            return (<div className="loading" />);
        }

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
