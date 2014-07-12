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
          <ResourceDetail label="Status">
            {"?Attached to Instance Name?"}
          </ResourceDetail>
        );
      }

    });

  });
