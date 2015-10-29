import React from  'react';
import $ from  'jquery';
// plugin
import Bootstrap from  'bootstrap';

export default React.createClass({
      displayName: "ProjectResource",

      propTypes: {
        icon: React.PropTypes.string.isRequired,
        count: React.PropTypes.number.isRequired,
        resourceType: React.PropTypes.string.isRequired
      },

      componentDidMount: function () {
        var el = this.getDOMNode();
        var $el = $(el);
        $el.tooltip({
          title: this.props.count + " " + this.props.resourceType
        });
      },

      render: function () {
        var className = "glyphicon glyphicon-" + this.props.icon;

        return (
          <li>
            <i className={className}></i>
            <span>{this.props.count}</span>
          </li>
        );

      }
});
