import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import Backbone from 'backbone';
import stores from 'stores';
import actions from 'actions';
import modals from 'modals';
// plugin: jquery extension, not used directly
import bootstrap from 'bootstrap';


export default React.createClass({
    displayName: "RequestResourcesButton",

    componentDidMount: function () {
      this.generateTooltip();
    },

    componentDidUpdate: function () {
      this.generateTooltip();
    },

    generateTooltip: function () {
      var el = ReactDOM.findDOMNode(this);
      var $el = $(el);
      $el.tooltip({
        title: "Request more resources"
      });
    },

    hideTooltip: function () {
      $(ReactDOM.findDOMNode(this)).tooltip('hide');
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
