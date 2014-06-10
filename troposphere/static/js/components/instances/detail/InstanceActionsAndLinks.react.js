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
              <li>Actions</li>
              <li className="active"><a href="#">Image</a></li>
              <li><a href="#">Report</a></li>
              <li><a href="#">Reboot</a></li>
              <li><a href="#">Suspend</a></li>
              <li><a href="#">Stop</a></li>
              <li><a href="#">Resize</a></li>
              <li>Links</li>
              <li><a href="#">Open Web Shell</a></li>
              <li><a href="#">Remote Desktop</a></li>
            </ul>
          </div>

        );
      }

    });

  });
