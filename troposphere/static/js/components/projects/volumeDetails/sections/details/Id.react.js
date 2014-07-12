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
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <ResourceDetail label="ID">
            {this.props.volume.id}
          </ResourceDetail>
        );
      }

    });

  });
