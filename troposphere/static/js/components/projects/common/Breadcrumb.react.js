/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        breadcrumb: React.PropTypes.object.isRequired,
        isCurrentLocation: React.PropTypes.bool
      },

      render: function () {
        var breadcrumb = this.props.breadcrumb;

        if(this.props.isCurrentLocation){
          return (
            <span>{breadcrumb.name}</span>
          );
        }else {
          return (
            <span className="breadcrumb">
              <a href={breadcrumb.url}>{breadcrumb.name}</a>
              <span>{" > "}</span>
            </span>
          );
        }
      }

    });

  });
