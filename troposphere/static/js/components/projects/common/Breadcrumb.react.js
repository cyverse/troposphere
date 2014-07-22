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
            <span style={{color: "#56AA21"}}>{breadcrumb.name}</span>
          );
        }else {
          return (
            <a style={{color: "#333"}} href={breadcrumb.url}>{breadcrumb.name + " > "}</a>
          );
        }
      }

    });

  });
