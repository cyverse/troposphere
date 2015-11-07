import React from 'react/addons';
import $ from "jquery";
// plugin: required but not used directly
import bootstrap from 'bootstrap';

export default React.createClass({
    displayName: "Button",

    propTypes: {
      isVisible: React.PropTypes.bool.isRequired,
      tooltip: React.PropTypes.string,
      onClick: React.PropTypes.func.isRequired,
      icon: React.PropTypes.string.isRequired,
      style: React.PropTypes.object
    },

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
        title: this.props.tooltip
      });
    },

    render: function () {
      var style = this.props.style || {};
      if (this.props.isVisible) {
        return (
          <button className="btn btn-default" style={style} onClick={this.props.onClick}>
            <i className={"glyphicon glyphicon-" + this.props.icon}/>
          </button>
        );
      }
      return null;
    }
});
