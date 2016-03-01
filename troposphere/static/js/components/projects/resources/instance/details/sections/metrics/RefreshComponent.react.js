define(function(require) {
  var React = require('react'),
    moment = require('moment');

  return React.createClass({
    displayName: "RefreshComponent",

    componentDidMount: function() {
       var me = this;

       // Refresh the timestamp, update whether refresh is active, every
       // updateInterval
       var updateInterval = 3 * 1000;

       var id = setInterval(function() {
         if (!me.isMounted()) {
           window.clearInterval(id);
        } else {
           me.forceUpdate();
        }
       }, updateInterval);
    },

    getTimeMessage: function() {
      var a = moment(this.props.timestamp);
      var b = moment(Date.now());
      var diff = b.diff(a, "seconds");

      // momentjs js is eager in saying a minute ago, this way when a
      // minute has passed getTimeMessage emits 'Updated a minute ago' in
      // sync with the refresh being available. (also in sync with fresh
      // metrics being available
      if (diff > 44 && diff < 60) {
        return "Updated a few seconds ago";
      }
      return "Updated " + a.fromNow();
    },

    render: function() {
        var canRefresh =
            (Date.now() - this.props.timestamp) > this.props.delay;

        var controlsClass =
            "glyphicon glyphicon-refresh" + (canRefresh ? "" : " disabled");

        return (
            <div>
                <span
                    id="refresh"
                    className={ controlsClass }
                    onClick={ canRefresh ? this.props.onRefreshClick : "" } />
                <div id="timestamp">{ this.getTimeMessage() }</div>
            </div>
        );
     }

  });

});
