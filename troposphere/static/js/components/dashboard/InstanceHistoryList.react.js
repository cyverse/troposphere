define(function(require) {

  var React = require('react/addons'),
    stores = require('stores'),
    moment = require('moment'),
    CryptoJS = require('crypto-js'),
    Gravatar = require('components/common/Gravatar.react'),
    Router = require('react-router');

  return React.createClass({
    displayName: "InstanceHistoryList",

    getInitialState: function() {
      return {
        isLoadingMoreResults: false,
        nextUrl: null,
        lastUpdated: moment()
      }
    },

    updateState: function() {
      var instanceHistories = stores.InstanceHistoryStore.getAll(),
        state = {};

      if (instanceHistories && instanceHistories.meta.next !== this.state.nextUrl) {
        state.isLoadingMoreResults = false;
        state.nextUrl = null;
      }

      if (this.isMounted()) this.setState(state);
    },

    componentDidMount: function() {
      stores.InstanceHistoryStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
      stores.InstanceHistoryStore.removeChangeListener(this.updateState);
    },

    onLoadMoreInstanceHistory: function() {
      var instanceHistories = stores.InstanceHistoryStore.getAll();

      this.setState({
        isLoadingMoreResults: true,
        nextUrl: instanceHistories.meta.next
      });
      stores.InstanceHistoryStore.fetchMore();
    },

    refreshHistory: function(){
        //console.log(stores.InstanceHistoryStore.getAll());
        //console.log(this.state.lastUpdated);
        this.forceUpdate();
    },

    renderRefreshButton: function(){
      var me = this;
      var updateInterval = 5*1000;
      //var id = setInterval(function() {
      //  me.forceUpdate();
      //}, updateInterval);
      return (       
          <div onClick={this.refreshHistory} className="glyphicon glyphicon-refresh"></div>
      );
       // var me = this;

       // Refresh the timestamp, update whether refresh is active, every
       // updateInterval
       // var updateInterval = 5 * 1000;
    
       // var id = setInterval(function() {
       //   if (!me.isMounted()) {
       //     window.clearInterval(id);
       //  } else {
       //     me.forceUpdate();
       //  }
       // }, updateInterval);
    // },

    // getTimeMessage: function() {
      // var a = moment(this.props.timestamp);
      // var b = moment(Date.now());
      // var diff = b.diff(a, "seconds");

      // // momentjs js is eager in saying a minute ago, this way when a
      // // minute has passed getTimeMessage emits 'Updated a minute ago' in
      // // sync with the refresh being available. (also in sync with fresh
      // // metrics being available
      // if (diff > 44 && diff < 60) {
       //  return "Updated a few seconds ago"
      // }
      // return "Updated " + a.fromNow();
    // },

    // render: function() {

     // var canRefresh =
       // (Date.now() - this.props.timestamp) > this.props.delay;

     // var controlsClass =
       // "glyphicon glyphicon-refresh" + (canRefresh ? "" : " disabled");

     // return (
       //   <div>
       //     <span
       //       id="refresh"
       //       className={ controlsClass }
       //  return <div className="glyphicon" onClick={this.refreshHistory}>YOOOO</div>
    },

    renderTitle: function() {
      var instanceHistories = stores.InstanceHistoryStore.getAll(),
        title = "Instance History",
        historyCount;

      if (instanceHistories) {
        historyCount = " (" + instanceHistories.meta.count + " instances launched)";
        title += historyCount;
      }

      return title;
    },

    renderLoadMoreHistoryButton: function(instanceHistories) {
      // Load more instances from history
      var buttonStyle = {
          margin: "auto",
          display: "block"
        },
        loadingStyle = {
          margin: "0px auto"
        },
        moreHistoryButton = null;

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
      var instanceHistories = stores.InstanceHistoryStore.getAll(),
          instances = stores.InstanceStore.fetchWhereNoCache({'archived': 'true'}),
          providers = stores.ProviderStore.getAll(),
          instanceHistoryItems;

      if(!instanceHistories || !instances || !providers) return <div className="loading"></div>;

      instanceHistoryItems = instanceHistories.map(function(instance) {
        var providerId = null,
            image = instance.get('image'),
            provider = instance.get('provider'),
            instanceId = instance.get('instance').id;

        var startDate = instance.get('start_date'),
            endDate = instance.get('end_date'),
            formattedStartDate = startDate.format("MMM DD, YYYY"),
            formattedEndDate = endDate.format("MMM DD, YYYY"),
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

        return (
          <div key={instance.cid}>
            <div className="instance-history">
              <ul>
                <li>
                  <div>
                    <Gravatar hash={instanceHistoryHash} size={iconSize} type={type}/>
                    <div className="instance-history-details">
                      <strong className="name">{instance.get('name')}</strong>
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
          {this.renderLoadMoreHistoryButton(instanceHistories)}
        </div>
      );
    },

    render: function() {
      console.log("rendering history");
      return (
        <div>
          <h2>
            {this.renderTitle()}
            {this.renderRefreshButton()}
          </h2>
          {this.renderBody()}
        </div>
      );
    }

  });

});
