import React from "react";

import stores from "stores";
import globals from "globals";

import InstanceDetailsSection from "components/projects/resources/instance/details/sections/InstanceDetailsSection";
import PastInstanceDetailsSection from "components/projects/resources/instance/details/sections/PastInstanceDetailsSection";
import InstanceActionsAndLinks from "components/projects/resources/instance/details/actions/InstanceActionsAndLinks";
import InstanceMetricsSection from "components/projects/resources/instance/details/sections/InstanceMetricsSection";
import Instance from "models/Instance";
import InstanceState from "models/InstanceState";
import InstanceInfoSection from "components/projects/resources/instance/details/sections/InstanceInfoSection";
import InstanceHistorySection from "components/common/InstanceHistorySection";


var InstanceDetail = React.createClass({
    displayName: "InstanceDetail",

    propTypes: {
        params: React.PropTypes.object
    },

    onNewData: function() { this.forceUpdate(); },

    componentDidMount: function() {
        stores.InstanceStore.addChangeListener(this.onNewData);
        stores.InstanceHistoryStore.addChangeListener(this.onNewData);
        stores.ProviderStore.addChangeListener(this.onNewData);
    },

    componentWillUnmount: function() {
        stores.InstanceStore.removeChangeListener(this.onNewData);
        stores.InstanceHistoryStore.removeChangeListener(this.onNewData);
        stores.ProviderStore.removeChangeListener(this.onNewData);
    },

    renderInactiveInstance: function(history) {
        var instanceHistory = history.first(),
            instanceObj = new Instance(instanceHistory.get("instance")),
            instanceStateObj = new InstanceState({
                "status_raw": "deleted"
            }),
            image = instanceHistory.get("image"),
            size = instanceHistory.get("size"),
            dateStart = new Date(instanceHistory.get("start_date")),
            dateEnd = new Date(instanceHistory.get("end_date"));

        // Construct a proper instance from the instance history information
        instanceObj.set("image", image);
        instanceObj.set("size", size);
        instanceObj.set("state", instanceStateObj);
        instanceObj.set("start_date", dateStart);
        instanceObj.set("end_date", dateEnd);

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
        var metrics = globals.SHOW_INSTANCE_METRICS
            ? <InstanceMetricsSection instance={instance} />
            : "";

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
                    <InstanceActionsAndLinks project={null} instance={instance} />
                </div>
            </div>
        </div>
        );
    },

    render: function() {
        let { params } = this.props;
        let instances = stores.InstanceStore.getAll();
        let instance = instances && instances.get(params.id);
        let history = stores.InstanceHistoryStore.fetchWhere({
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

export default InstanceDetail;
