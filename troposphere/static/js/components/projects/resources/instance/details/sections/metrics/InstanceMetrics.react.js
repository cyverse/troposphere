define(function(require) {
  var React = require('react'),
    GraphController = require('./GraphController'),
    TimeframeBreadcrumb = require('./TimeframeBreadcrumb.react'),
    RefreshComponent = require('./RefreshComponent.react'),
    moment = require('moment');


  return React.createClass({
    displayName: "InstanceMetrics",

    getInitialState: function() {
      var me = this;
      return {
        controller: null,
        uuid: this.props.instance.get("uuid"),
        until: this.props.instance.get("end_date"),
        timeframe: "1 hour",
        timestamp: new Date(),

        // Individual graph widths
        graphWidth: 550,

        // Determine if service is available
        //   null: service has no status (loading)
        //   false: metrics api failed
        //   true: metrics api success
        available: null,

        // Restrict refreshing
        canRefresh: false,

        // Set refresh interval to 1 minute
        refreshDelay: 60 * 1000,
      };
    },
    onSuccess: function() {

      // Conviluted way to fetch timestamp from store, off first graph
      var timestamp = this.state.controller.store.get({
        uuid: this.state.uuid,
        timeframe: this.state.timeframe
      })[0].timestamp;

      // Called after successfully fetching data
      this.setState({
        available: true,
        timestamp: timestamp,
      });
    },

    onError: function() {
      // Called after failing to fetch data
      //throw new Error("metrics could not be fetched");
      this.setState({ available: false });
    },
    componentDidMount: function() {
      var prov = this.props.instance.get('provider').id || this.props.instance.get('provider');

      // Metrics are only available for 4 and 5
      if (!(prov == 4 || prov == 5)) {
          return;
      }

      // Kickstart graphs since d3 needs a finished dom
      this.setState({
        controller: new GraphController({
          container: document.querySelector("#graphs"),
          width: this.state.graphWidth,
        }),
      }, this.refresh)
    },

    refresh: function() {
      var me = this,
          until = null,
          start = null;

      /*
      If the instance is no longer active, pass the end date to the api
      */
      if(this.state.until){
        switch(this.state.timeframe){
            case "1 hour":
              start = moment(this.state.until);
              start.subtract(1, "hour");
              break;

            case "1 day":
              start = moment(this.state.until);
              start.subtract(1, "day");
              break;

            case "1 week":
              start = moment(this.state.until);
              start.subtract(7, "day");
              break;
        }
        start = start.format("hh:mmYYYYMMDD");
        until = this.state.until.format("hh:mmYYYYMMDD");
      }

      // Disable refresh button
      me.setState({
        canRefresh: false,
      }, function() {
        this.state.controller.switch({
          uuid: this.state.uuid,
          from: start,
          until: until,
          timeframe: this.state.timeframe,
          refresh: true,
        }, this.onSuccess, this.onError);
      })
    },

    onTimeFrameClick : function(e) {
      var start = null, until = null;
      /*
      If the instance is no longer active, get the last two weeks of activity before it
      was end dated
      */

      if(this.state.until){
        switch(e.target.innerHTML){
            case "1 hour":
              start = moment(this.state.until);
              start.subtract(1, "hour");
              break;

            case "1 day":
              start = moment(this.state.until);
              start.subtract(1, "day");
              break;

            case "1 week":
              start = moment(this.state.until);
              start.subtract(7, "day");
              break;
        }
        start = start.format("hh:mmYYYYMMDD");
        until = this.state.until.format("hh:mmYYYYMMDD");
      }

      this.setState({
        timeframe: e.target.innerHTML
      }, function(){
        this.state.controller.switch({
          uuid: this.state.uuid,
          from: start,
          until: until,
          timeframe: this.state.timeframe
        }, this.onSuccess, this.onError);
      });
    },

    onRefreshClick: function() {
      if (this.state.canRefresh)
        this.refresh();
    },

    render: function() {
      var refresh;
      if(!this.props.inactive){
        refresh = (
            <RefreshComponent
              delay={ this.state.refreshDelay }
              timestamp={ this.state.timestamp }
              onRefreshClick={ this.refresh }
            />
        );
      }

      var prov = this.props.instance.get('provider').id || this.props.instance.get('provider');
      if (!(prov == 4 || prov == 5)) {
         return (<div id="not-available">Instance metrics are not available on this provider</div>)
      }

      // available is true or still waiting for network request
      if (this.state.available || this.state.available === null) {
       return (
         <div id="InstanceMetrics">
           <div
            id="controls"
            style={{
              display : this.state.available ? "inherit" : "none"
            }}>
            <TimeframeBreadcrumb
               timeframe={ this.state.timeframe }
               onTimeFrameClick={ this.onTimeFrameClick }
            />
            {refresh}
          </div>
          <div id="container" className="metrics">
             <div className="loading"></div>
             <div id="graphs"></div>
          </div>
        </div>
      )
     }

     // available is explicitly false, the network request failed
     return (<div id="not-available">Instance metrics not available</div>)
     }

  });

});
