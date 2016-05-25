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

    onClick: function(){
      var el = this.getDOMNode();
      var $el = $(el);
      //Manually hides tooltip to fix a bug when using modals 
      //See: https://github.com/iPlantCollaborativeOpenSource/troposphere/pull/201
      $el.tooltip('hide');
      this.props.onClick();
    },

    render: function () {
      var style = this.props.style || {};
      if (this.props.isVisible) {
        return (
          <button className="btn btn-default" style={style} onClick={this.onClick}>
            <i className={"glyphicon glyphicon-" + this.props.icon}/>
          </button>
        );
      }
      return null;
    }
});
