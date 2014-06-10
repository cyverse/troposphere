/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {
        return (
          <div>
            <ul className="nav nav-pills nav-stacked" style={{"max-width": "300px"}}>
              <li className="active"><a href="#">Home</a></li>
              <li><a href="#">Profile</a></li>
              <li><a href="#">Messages</a></li>
            </ul>
          </div>

        );
      }

    });

  });
