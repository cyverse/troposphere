/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {
        /*
          Display of Cloud capacity. Especially making it clear ~ "this one is
          almost full, launching larger instance sizes may not be possible."
         */
        return (
          <div className="">
            <h2>Cloud Capacity</h2>
          </div>
        );
      }

    });

  });
