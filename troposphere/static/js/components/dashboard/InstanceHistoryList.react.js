import React from 'react/addons'
import stores from 'stores'
import moment from 'moment'
import CryptoJS from 'crypto-js'
import Gravatar from 'components/common/Gravatar.react'
import RefreshComponent from 'components/projects/resources/instance/details/sections/metrics/RefreshComponent.react'
import Router from 'react-router'

export default React.createClass({
    displayName: "InstanceHistoryList",

    getInitialState: function() {
      return {
        instanceHistoryItems: stores.InstanceHistoryStore.fetchWhere({"page_size": 10})
      }
    },

    onNewData: function(){
        this.setState({instanceHistoryItems: stores.InstanceHistoryStore.fetchWhere({"page_size": 10})});
    },

    componentDidMount: function() {
     stores.InstanceHistoryStore.addChangeListener(this.onNewData);
    },

    componentWillUnmount: function() {
      stores.InstanceHistoryStore.removeChangeListener(this.updateState);
    },

    onLoadMoreInstanceHistory: function() {
        stores.InstanceHistoryStore.fetchMoreWhere({"page_size": 10});
    },

    refreshHistory: function(){
        this.setState({instanceHistoryItems: stores.InstanceHistoryStore.fetchFirstPageWhere({"page_size": 10}, {clearQueryCache: true})});
        stores.InstanceHistoryStore.lastUpdated = Date.now();
    },

    renderRefreshButton: function(){

      return (
        <span className="pull-right refresh-button">
            <RefreshComponent onRefreshClick = {this.refreshHistory} timestamp = {stores.InstanceHistoryStore.lastUpdated} delay = {1000 * 60} />
        </span>
      );

    },

    renderTitle: function() {
      var instanceHistories = this.state.instanceHistoryItems,
        title = "Instance History",
        historyCount;

      if (instanceHistories) {
        historyCount = " (" + instanceHistories.meta.count + " instances launched)";
        title += historyCount;
      }

      return title;
    },

    renderLoadMoreHistoryButton: function() {
      // Load more instances from history
      var buttonStyle = {
          margin: "auto",
          display: "block"
        },
        loadingStyle = {
          margin: "0px auto"
        },
        moreHistoryButton = null,
        instanceHistories = this.state.instanceHistoryItems;

      if (instanceHistories.meta.next) {
        if (this.state.isLoadingMoreResults) {
          moreHistoryButton = (
            <div style={loadingStyle} className="loading"></div>
          );
        } else {
          moreHistoryButton = (
            <button style={buttonStyle} className="btn btn-default" onClick={this.onLoadMoreInstanceHistory}>
              Show More History
            </button>
          );
        }
      }

      return moreHistoryButton;
    },

    renderBody: function() {
      var instanceHistories = this.state.instanceHistoryItems,
          instances = stores.InstanceStore.getAll(),
          providers = stores.ProviderStore.getAll(),
          instanceHistoryItems;

      if(!instanceHistories || !instances || !providers) return <div className="loading"></div>;

      instanceHistoryItems = instanceHistories.map(function(instance) {
        var providerId = null,
            name = instance.get('instance').name,
            image = instance.get('image'),
            provider = instance.get('provider'),
            instanceId = instance.get('instance').id;

        var startDate = instance.get('start_date'),
            endDate = instance.get('end_date'),
            formattedStartDate = startDate.format("MMM DD, YYYY hh:mm a"),
            formattedEndDate = endDate.format("MMM DD, YYYY hh:mm a"),
            now = moment(),
            timeSpan = now.diff(startDate, "days"),
            instanceHistoryHash = CryptoJS.MD5((instance.id || instance.cid).toString()).toString(),
            iconSize = 63,
            type = stores.ProfileStore.get().get('icon_set'),
            imageName = image ? image.name : "[image no longer exists]",
            imageLink;

        if(!endDate.isValid()) formattedEndDate = "Present";

        if(image){
          imageLink = (
            <Router.Link to="image-details" params={{imageId: image.id}}>
              {imageName}
            </Router.Link>
          )
        }else{
          imageLink = (
            <strong>{imageName}</strong>
          )
        }

        if(!provider){
            provider = {name: '[no provider name]'};
        }

        return (
          <div key={instance.cid}>
            <div className="instance-history">
              <ul>
                <li>
                  <div>
                    <Gravatar hash={instanceHistoryHash} size={iconSize} type={type}/>
                    <div className="instance-history-details">
                      <strong className="name">{name}</strong>
                      <div>Launched from {imageLink}</div>
                      <div>{"Ran: " + formattedStartDate + " - " + formattedEndDate}</div>
                    </div>
                    <span className="launch-info">
                      <strong>{timeSpan + " days ago"}</strong>
                      {" on " + provider.name}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        );
      }.bind(this));

      return (
        <div>
          {instanceHistoryItems}
          {this.renderLoadMoreHistoryButton()}
        </div>
      );
    },

    render: function() {
      return (
        <div onClick={this.loadMoreHistory}>
          <h2>
            {this.renderTitle()}
            {this.renderRefreshButton()}
          </h2>
          {this.renderBody()}
        </div>
      );
    }
});
