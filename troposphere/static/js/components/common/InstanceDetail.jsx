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

    getInitialState: function() {
        let { params } = this.props;
        return {
            instance: stores.InstanceStore.get(params.id),
            instanceHistory: stores.InstanceHistoryStore.fetchWhere({
                "instance": params.id
            })
        }
    },

    onNewData: function() {
        let { params } = this.props;
        this.setState({
            instance: stores.InstanceStore.get(params.id),
            instanceHistory: stores.InstanceHistoryStore.fetchWhere({
                "instance": params.id
            })
        });
    },

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

    renderInactiveInstance: function() {
        // FIXME - there is a safer, more polite way to get the first model
        var instanceHistory = this.state.instanceHistory.models[0],
            instanceObj = new Instance(instanceHistory.get("instance")),
            instanceStateObj = new InstanceState({
                "status_raw": "deleted"
            }),
            image = instanceHistory.get("image"),
            size = instanceHistory.get("size"),
            dateStart = new Date(instanceHistory.get("start_date")),
            // FIXME - consider making this a function that returns `dateEnd`
            // If the instance is given an end date in the delete action, use the end date
            dateEnd = (this.state.instance
                    && this.state.instance.get("end_date"))
                    || new Date(instanceHistory.get("end_date"));

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

    renderActiveInstance: function() {
        var instance = this.state.instance;
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
        if (!this.state.instanceHistory) {
            return <div className="loading" />
        }

        return this.state.instance && !this.state.instance.get("end_date") ? this.renderActiveInstance() : this.renderInactiveInstance();

    },

});

export default InstanceDetail;
