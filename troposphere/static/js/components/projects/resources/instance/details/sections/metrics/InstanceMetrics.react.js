define(function(require) {
  var React = require('react'),
    GraphController = require('./GraphController'),
    TimeframeBreadcrumb = require('./TimeframeBreadcrumb.react'),
    RefreshComponent = require('./RefreshComponent.react');


  return React.createClass({

    getInitialState: function() {
      var me = this;

      return {
        controller: null,
        uuid: this.props.instance.get("uuid"),
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
      var prov = this.props.instance.get('provider').id;

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
      var me = this;

      // Disable refresh button
      me.setState({
        canRefresh: false,
      }, function() {
        this.state.controller.switch({
          uuid: this.state.uuid,
          timeframe: this.state.timeframe,
          refresh: true,
        }, this.onSuccess, this.onError);
      })
    },

    onTimeFrameClick : function(e) {
      this.setState({
        timeframe: e.target.innerHTML
      }, function(){
        this.state.controller.switch({
          uuid: this.state.uuid,
          timeframe: this.state.timeframe
        }, this.onSuccess, this.onError);
      });
    },

    onRefreshClick: function() {
      if (this.state.canRefresh)
        this.refresh();
    },

    render: function() {

      var prov = this.props.instance.get('provider').id;
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
            <RefreshComponent
              delay={ this.state.refreshDelay }
              timestamp={ this.state.timestamp }
              onRefreshClick={ this.refresh }
            />
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
