import React from 'react';
import Router from 'react-router';
import Backbone from 'backbone';
import BreadcrumbBar from 'components/projects/common/BreadcrumbBar.react';
import InstanceInfoSection from 'components/projects/resources/instance/details/sections/InstanceInfoSection.react';
import InstanceDetailsSection from 'components/projects/resources/instance/details/sections/InstanceDetailsSection.react';
import InstanceMetricsSection from 'components/projects/resources/instance/details/sections/InstanceMetricsSection.react';
import InstanceActionsAndLinks from 'components/projects/resources/instance/details/actions/InstanceActionsAndLinks.react';
import stores from 'stores';
import Time from 'components/common/Time.react';
import ResourceTags from 'components/projects/resources/instance/details/sections/ResourceTags.react';
import actions from 'actions';
import moment from 'moment';
import CryptoJS from 'crypto-js';
import Gravatar from 'components/common/Gravatar.react';

export default React.createClass({
    displayName: "InstanceDetailsView",

    mixins: [Router.State],

    getInitialState: function(){
        return{
            instanceHistoryItems: stores.InstanceHistoryStore.fetchWhere({"instance": this.getParams().id})
        }
    },

    onNewData: function(){
        this.setState({"instanceHistoryItems": stores.InstanceHistoryStore.fetchWhere({"instance": this.getParams().id})});
    },

    componentDidMount: function(){
        stores.InstanceHistoryStore.addChangeListener(this.onNewData);
        stores.ProviderStore.addChangeListener(this.onNewData);
    },

    componentWillUnmount: function() {
      stores.InstanceHistoryStore.removeChangeListener(this.onNewData);
    },

    render: function () {
      var instanceId = this.getParams().id,
          instanceHistories = stores.InstanceHistoryStore.fetchWhere({"instance": instanceId});

      if(!this.state.instanceHistoryItems){
        return (
            <div className="loading" />
        );
      }

      var instance = this.state.instanceHistoryItems.models[0].get('instance'),
        instanceTags = stores.InstanceTagStore.getTagsFor(instance),
        instanceHash = CryptoJS.MD5((instance.id || instance.cid).toString()).toString(),
        type = stores.ProfileStore.get().get('icon_set'),
        iconSize = 113,
        providerName = stores.ProviderStore.get(instance.provider),
        nameContent;

      var currentStatusText;

      if(!moment(instance.end_date).isValid()) {
        currentStatusText = instance.status;
      }
      else{
        currentStatusText = "Deleted on " + moment(instance.end_date).format("MMM DD, YYYY hh:mm a");
      }

      var instanceStatusHistories = stores.InstanceHistoryStore.fetchWhere({instance: instanceId});

      if (!instanceTags || !instanceStatusHistories|| !providerName) return <div className="loading"></div>;

      var instanceStatusHistoryItems = instanceStatusHistories.map(function(historyItem){
        var startDate = new Date(historyItem.get('start_date'));
        var endDate = new Date(historyItem.get('end_date'));

        var formattedStartDate = moment(startDate).format("MMM DD, YYYY hh:mm a"),
        formattedEndDate = moment(endDate).format("MMM DD, YYYY hh:mm a");

        return (
            <li key={historyItem.cid}>
                {historyItem.get('status')}: {formattedStartDate.toString()} - {formattedEndDate.toString()}
            </li>
        );
      });

      return (
        <div className="instance-history-detail">
            <div className="container">
                <div className="pull-left instance-history-info resource-details-content">
                      <div className="resource-image">
                        <Gravatar hash={instanceHash} size={iconSize} type={type}/>
                      </div>

                      <div className="resource-info">
                        <div className="resource-name">
                          <h4>{instance.name}</h4>
                        </div>
                        <p>Launched on <Time date={new Date(instance.start_date)}/></p>
                        <p>{currentStatusText}</p>
                        <p>Provider: {providerName.get('name')}</p>
                        <p>ID: {instance.id}</p>
                        <p>Alias: {instance.uuid}</p>
                      </div>
                </div>

                <div className="pull-right instance-status-history">
                    <h4>Instance Status History</h4>
                    <ul className="list-unstyled status-history">
                        {instanceStatusHistoryItems}
                    </ul>
                </div>
            </div>
        </div>
      );
    }
});
