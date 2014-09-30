/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {

      },

      render: function () {
        return (
          <p>
            You have not added any instances to this project.
            <a href="/application/images">
              Create an instance.
            </a>
          </p>
        );
      }

    });

  });
