import React from 'react';
import Router from 'react-router';

export default React.createClass({
    displayName: "ProjectsBreadcrumb",

    propTypes: {
      breadcrumb: React.PropTypes.object.isRequired,
      isCurrentLocation: React.PropTypes.bool
    },

    render: function () {
      var breadcrumb = this.props.breadcrumb;

      if (this.props.isCurrentLocation) {
        return (
          <span>{breadcrumb.name}</span>
        );
      }

      return (
        <span className="breadcrumb">
          <Router.Link to={breadcrumb.linksTo} params={breadcrumb.params || {}}>
            {breadcrumb.name}
          </Router.Link>
          <span>{" > "}</span>
        </span>
      );
    }
});
