import React from 'react';
import Router from 'react-router';
import Backbone from 'backbone';
import stores from 'stores';
import InstanceDetailsSection from 'components/projects/resources/instance/details/sections/InstanceDetailsSection.react';
import PastInstanceDetailsSection from 'components/projects/resources/instance/details/sections/PastInstanceDetailsSection.react';
import InstanceActionsAndLinks from 'components/projects/resources/instance/details/actions/InstanceActionsAndLinks.react';
import InstanceMetricsSection from 'components/projects/resources/instance/details/sections/InstanceMetricsSection.react';
import Instance from 'models/Instance';
import InstanceState from 'models/InstanceState';
import InstanceInfoSection from 'components/projects/resources/instance/details/sections/InstanceInfoSection.react';
import InstanceHistorySection from 'components/common/InstanceHistorySection.react';

var InstanceDetail = React.createClass({
    displayName: "InstanceDetail",

    mixins: [Router.State],

    getInitialState: function(){
        return{
            instance: stores.InstanceStore.get(this.getParams().id),
            instanceHistory: stores.InstanceHistoryStore.fetchWhere({"instance": this.getParams().id})
        }
    },

    onNewData: function(){
        this.setState({instance: stores.InstanceStore.get(this.getParams().id), instanceHistory: stores.InstanceHistoryStore.fetchWhere({"instance": this.getParams().id})});
    },

    componentDidMount: function(){
        stores.InstanceStore.addChangeListener(this.onNewData);
        stores.InstanceHistoryStore.addChangeListener(this.onNewData);
        stores.ProviderStore.addChangeListener(this.onNewData);
    },

    componentWillUnmount: function(){
        stores.InstanceStore.removeChangeListener(this.onNewData);
        stores.InstanceHistoryStore.removeChangeListener(this.onNewData);
        stores.ProviderStore.removeChangeListener(this.onNewData);
    },

    renderInactiveInstance: function(){
        var instanceHistory = this.state.instanceHistory.models[0],
            instanceObj = new Instance(instanceHistory.get('instance')),
            instanceStateObj = new InstanceState({"status_raw": "deleted"}),
            image = instanceHistory.get('image'),
            size = instanceHistory.get('size'),
            dateStart = new Date(instanceHistory.get('start_date')),
            // If the instance is given an end date in the delete action, use the end date
            dateEnd = (this.state.instance && this.state.instance.get('end_date')) || new Date(instanceHistory.get('end_date'));

        // Construct a proper instance from the instance history information
        instanceObj.set('image', image);
        instanceObj.set('size', size);
        instanceObj.set('state', instanceStateObj);
        instanceObj.set('start_date', dateStart);
        instanceObj.set('end_date', dateEnd);

        var metrics = typeof show_instance_metrics != "undefined" ? <InstanceMetricsSection instance={instanceObj}/> : "";

        return (
            <div className="container">
              <div className="row resource-details-content">
                <div className="col-md-9">
                    <InstanceInfoSection instance={instanceObj}/>
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

    renderActiveInstance: function(){
        var instance = this.state.instance;
        var metrics = typeof show_instance_metrics != "undefined" ? <InstanceMetricsSection instance={instance}/> : "";

        return (
            <div className="container">
              <div className="row resource-details-content">
                <div className="col-md-9">
                    <InstanceInfoSection instance={instance}/>
                    <hr/>
                    <InstanceDetailsSection instance={instance} />
                    <hr/>
                    {metrics}
                    <hr/>
                    <InstanceHistorySection instance={instance} />
                </div>
                <div className="col-md-3">
                    <InstanceActionsAndLinks
                        project={null}
                        instance={instance}
                    />
                </div>
              </div>
            </div>
        );
    },

    render: function(){
        if(!this.state.instanceHistory){
            return <div className="loading" />
        }

        return this.state.instance && !this.state.instance.get('end_date') ? this.renderActiveInstance() : this.renderInactiveInstance();

    },

});

export default InstanceDetail;
