import React from "react";

import subscribe from "utilities/subscribe";
import globals from "globals";

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
        <div className="container">
            <div className="row resource-details-content">
                <div className="col-md-9">
                    <InstanceInfoSection instance={instanceObj} />
                    <hr />
                    <PastInstanceDetailsSection instance={instanceObj} />
                    {metrics}
                </div>
            </div>
            <hr/>
            <InstanceHistorySection instance={instanceObj} />
        </div>
        );
    },

    renderActiveInstance: function(instance) {
        let { ProjectStore } = this.props.subscriptions;
        var metrics = globals.SHOW_INSTANCE_METRICS
            ? <InstanceMetricsSection instance={instance} />
            : "";
        let project = ProjectStore.get(instance.get('project').id);
        if (!project) {
            return (<div className="loading" />);
        }

        return (
        <div className="container">
            <div className="row resource-details-content">
                <div className="col-md-9">
                    <InstanceInfoSection instance={instance} />
                    <hr/>
                    <InstanceDetailsSection instance={instance} />
                    <hr/>
                    {metrics}
                    <hr/>
                    <InstanceHistorySection instance={instance} />
                </div>
                <div className="col-md-3">
                    <InstanceActionsAndLinks project={project} instance={instance} />
                </div>
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
        if (!instance) {
            return this.renderInactiveInstance(history);
        }

        return this.renderActiveInstance(instance);
    },

});

export default subscribe(InstanceDetail, ["ProjectStore", "ImageStore", "InstanceStore", "InstanceHistoryStore"]);
