define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      stores = require('stores'),
      actions = require('actions'),
      // plugin: jquery extension, not used directly
      bootstrap = require('bootstrap');

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return React.createClass({

    getInitialState: function(){
      return {
        isRefreshing: false
      }
    },

    componentDidMount: function(){
      this.generateTooltip();
    },

    componentDidUpdate: function(){
      this.generateTooltip();
    },

    generateTooltip: function(){
      var el = this.getDOMNode();
      var $el = $(el);
      $el.tooltip({
        title: "Force a refresh"
      });
    },

    hideTooltip: function(){
      $(this.getDOMNode()).tooltip('hide');
    },

    handleRefresh: function(){
      var instances = stores.InstanceStore.getAll(),
          volumes = stores.VolumeStore.getAll(),
          refreshTime = randomIntFromInterval(5,7);

      // show the user something so they think the resources are polling...
      this.setState({isRefreshing: true});
      setTimeout(function(){
        if (this.isMounted()) this.setState({isRefreshing: false});
      }.bind(this), refreshTime*1000);

      // now actually poll the instances and volumes
      instances.each(function(instance){
        actions.InstanceActions.poll({instance: instance});
      });

      volumes.each(function(volume){
        actions.VolumeActions.poll({volume: volume});
      });

      // Fixes a bug in FireFox where the tooltip doesn't go away when button is clicked
      this.hideTooltip();
    },

    render: function () {
      var className = "glyphicon glyphicon-refresh";
      if(this.state.isRefreshing) className += " refreshing";

      return (
        <button className="btn btn-default" onClick={this.handleRefresh} disabled={this.state.isRefreshing}>
          <i className={className}/>
        </button>
      );
    }

  });

});
