/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {

      },

      //
      // Render
      // ------
      //

      render: function () {
        return (
          <ul>
            <li>
              <span>Volume</span>
              <span>Preview</span>
            </li>
            <li>
              <span>Volume</span>
              <span>Preview</span>
            </li>
            <li>
              <span>Volume</span>
              <span>Preview</span>
            </li>
          </ul>
        );
      }

    });

  });
