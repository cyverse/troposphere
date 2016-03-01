import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

require('bootstrap');

//
// Copied from http://bl.ocks.org/insin/raw/8449696/
//
let BootstrapModalMixin = function () {
  var handlerProps = [
    'handleShow',
    'handleShown',
    'handleHide',
    'handleHidden'
  ];

  var bsModalEvents = {
    handleShow: 'show.bs.modal',
    handleShown: 'shown.bs.modal',
    handleHide: 'hide.bs.modal',
    handleHidden: 'hidden.bs.modal'
  };

  return {
    displayName: "BreadcrumbModalMixin",

    propTypes: {
      handleShow: React.PropTypes.func,
      handleShown: React.PropTypes.func,
      handleHide: React.PropTypes.func,
      handleHidden: React.PropTypes.func,
      keyboard: React.PropTypes.bool,
      show: React.PropTypes.bool,
      remote: React.PropTypes.string
    },

    getDefaultProps: function () {
      return {
        backdrop: true,
        keyboard: true,
        show: true,
        remote: ''
      }
    },

    componentDidMount: function () {
      var $modal = $(ReactDOM.findDOMNode(this)).modal({
        backdrop: this.props.backdrop,
        keyboard: this.props.keyboard,
        show: this.props.show,
        remote: this.props.remote
      });

      handlerProps.forEach(function (prop) {
        if (this[prop]) {
          $modal.on(bsModalEvents[prop], this[prop])
        }
        if (this.props[prop]) {
          $modal.on(bsModalEvents[prop], this.props[prop])
        }
      }.bind(this))
    },

    componentWillUnmount: function () {
      var $modal = $(ReactDOM.findDOMNode(this));
      handlerProps.forEach(function (prop) {
        if (this[prop]) {
          $modal.off(bsModalEvents[prop], this[prop])
        }
        if (this.props[prop]) {
          $modal.off(bsModalEvents[prop], this.props[prop])
        }
      }.bind(this))
    },

    hide: function () {
      $(ReactDOM.findDOMNode(this)).modal('hide')
    },

    show: function () {
      $(ReactDOM.findDOMNode(this)).modal('show')
    },

    toggle: function () {
      $(ReactDOM.findDOMNode(this)).modal('toggle')
    },

    renderCloseButton: function () {
      return (
        <button type="button"
                className="close"
                onClick={this.hide}
          >
          {'\u00d7'}
        </button>
      );
    }

  }
}();

export default BootstrapModalMixin;
