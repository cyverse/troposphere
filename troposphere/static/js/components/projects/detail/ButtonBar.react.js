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
          <div className="button-bar">
            <button className="btn btn-default">
              <i className="glyphicon glyphicon-folder-open"/>
            </button>
          </div>
        );
      }

    });

  });
