define(function (require) {

  var React = require('react'),
      $ = require("jquery"),
      Backbone = require('backbone'),
      stores = require('stores'),
      actions = require('actions'),
      modals = require('modals'),
  // plugin: jquery extension, not used directly
      bootstrap = require('bootstrap');

  return React.createClass({
    displayName: "RequestResourcesButton",

    componentDidMount: function () {
      this.generateTooltip();
    },

    componentDidUpdate: function () {
      this.generateTooltip();
    },

    generateTooltip: function () {
      var el = this.getDOMNode();
      var $el = $(el);
      $el.tooltip({
        title: "Request more resources"
      });
    },

    hideTooltip: function () {
      $(this.getDOMNode()).tooltip('hide');
    },

    handleClick: function () { 
      modals.HelpModals.requestMoreResources();
      // Fixes a bug in FireFox where the tooltip doesn't go away when button is clicked
      this.hideTooltip();
    },

    render: function () {
      var className = "glyphicon glyphicon-circle-arrow-up";
      return (
        <button className="btn btn-default" onClick={this.handleClick}>
          <i className={className}/>
        </button>
      );
    }

  });

});
