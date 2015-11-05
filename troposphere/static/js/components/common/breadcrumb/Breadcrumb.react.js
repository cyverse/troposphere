import React from 'react/addons';
import Router from 'react-router';

export default React.createClass({

    displayName: "Breadcrumb",

    propTypes: {
      breadcrumb: React.PropTypes.object.isRequired,
      onClick: React.PropTypes.func.isRequired,
      breadcrumbText :React.PropTypes.number.isRequired,
    },

    mouseOver: function() {
      this.props.onMouseOn(this.props.breadcrumb.name);
    },

    mouseOut: function() {
      this.props.onMouseOff();
    },

    renderLink: function() {
      var class_names = this.props.breadcrumb.state;

      return (
          <div onMouseOver={this.mouseOver} onMouseOut={this.mouseOut} className={class_names} onClick={this.crumbClicked}>
            <span className="hidden-xs">Step </span> {this.props.breadcrumbText}
          </div>
        );
    },
    crumbClicked: function() {
      if (!this.props.breadcrumb.inactive) {
        return this.props.onClick(this.props.breadcrumb);
      }
    },
    render: function() {
      return this.renderLink();
    }
});
