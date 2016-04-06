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

  // var React = require('react/addons'),
  //   Router = require('react-router'),
  //   Backbone = require('backbone'),
  //   BreadcrumbBar = require('components/projects/common/BreadcrumbBar.react'),
  //   InstanceInfoSection = require('components/projects/resources/instance/details/sections/InstanceInfoSection.react'),
  //   InstanceDetailsSection = require('components/projects/resources/instance/details/sections/InstanceDetailsSection.react'),
  //
  //
  //   stores = require('stores'),
  //   Time = require('components/common/Time.react'),
  //   ResourceTags = require('components/projects/resources/instance/details/sections/ResourceTags.react'),
  //   actions = require('actions'),
  //   moment = require('moment'),
  //   CryptoJS = require('crypto-js'),
  //   Gravatar = require('components/common/Gravatar.react');

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
        this.setState({instanceHistory: stores.InstanceHistoryStore.fetchWhere({"instance": this.getParams().id})});
    },

    componentDidMount: function(){
        stores.InstanceStore.addChangeListener(this.onNewData);
        stores.InstanceHistoryStore.addChangeListener(this.onNewData);
        stores.ProviderStore.addChangeListener(this.onNewData);
    },

    renderInactiveInstance: function(){
        var detailsSection, metricsInstance, actions;
        var instanceObj = new Instance(this.state.instanceHistory.models[0].get('instance')),
            instanceStateObj = new InstanceState({"status_raw": "Deleted"}),
            image = this.state.instanceHistory.models[0].get('image'),
            size = this.state.instanceHistory.models[0].get('size');
        instanceObj.set('image', image);
        instanceObj.set('size', size);
        instanceObj.set('state', instanceStateObj);
        metricsInstance = instanceObj;
        detailsSection = <PastInstanceDetailsSection instance={instanceObj} />;
        return (
            <div className="container">
              <div className="row resource-details-content">
                <div className="col-md-9">
                  {detailsSection}
                  <hr/>
                  {
                    typeof show_instance_metrics != "undefined"
                    ? <InstanceMetricsSection instance={metricsInstance}/>
                    : ""
                  }
                </div>
                {actions}
              </div>
            </div>
        );
    },

    renderActiveInstance: function(){
        var detailsSection, metricsInstance, actions;
        metricsInstance = this.state.instance;
        actions = (
            <div className="col-md-3">
              <InstanceActionsAndLinks
                project={null}
                instance={metricsInstance}
                />
            </div>
        );
        detailsSection = <InstanceDetailsSection instance={this.state.instance} />;

        return (
            <div className="container">
              <div className="row resource-details-content">
                <div className="col-md-9">
                  {detailsSection}
                  <hr/>
                  {
                    typeof show_instance_metrics != "undefined"
                    ? <InstanceMetricsSection instance={metricsInstance}/>
                    : ""
                  }
                </div>
                {actions}
              </div>
            </div>
        );
    },

    render: function(){
        if(!this.state.instanceHistory){
            return <div className="loading" />
        }

        return this.state.instance ? this.renderActiveInstance() : this.renderInactiveInstance();


    },

});

export default InstanceDetail;
