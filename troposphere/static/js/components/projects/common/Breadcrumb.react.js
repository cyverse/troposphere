define(function (require) {

  var React = require('react'),
    Router = require('react-router');

  return React.createClass({

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

});
