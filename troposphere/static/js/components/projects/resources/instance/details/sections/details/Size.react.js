/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react'
  ],
  function (React, Backbone, ResourceDetail) {

    return React.createClass({

      propTypes: {
        size: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <ResourceDetail label="Size">
            {this.props.size.formattedDetails()}
          </ResourceDetail>
        );
      }

    });

  });
