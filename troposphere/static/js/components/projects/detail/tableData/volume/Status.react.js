/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <span>
            Attached to <a href="#">{"?iPlant Base Instance?"}</a>
          </span>
        );
      }

    });

  });
