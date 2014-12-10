/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',

    // plugins
    'bootstrap'
  ],
  function (React, Backbone) {

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

      handleRefresh: function(){
        var refreshTime = randomIntFromInterval(5,10);

        this.setState({isRefreshing: true});
        setTimeout(function(){
          this.setState({isRefreshing: false});
        }.bind(this), refreshTime*1000);
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
