/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {
        var rootStyles = {
          position: "relative"
        };

        var iconStyles = {
          "float": "left",
          "margin-right": "22px"
        };

        var editStyles = {
          "position": "absolute",
          "right": "20px",
          "top": "20px"
        };

        return (
          <div className="clearfix" style={rootStyles}>

            <div className="icon-container" style={iconStyles}>
              <a href="/application/images/9ab516c9-c39f-595e-a990-977642da4c0e">
                <img src="//www.gravatar.com/avatar/918bf82f238c6c264fc7701e1ff61363?d=identicon&amp;s=150" width="150" height="150"/>
              </a>
            </div>

            <div className="instance-info">
              <div>Instance Name</div>
              <div>Launched on March 3, 2014</div>
              <div>Instance Tags:</div>
              <ul className="tags">
                <li className="tag">
                  <a href="#">Existing Tag</a>
                </li>
                <li className="tag">
                  <a href="#">Existing Tag</a>
                </li>
              </ul>
            </div>

            <div className="edit-instance-link" style={editStyles}>
              <a href="#">Edit Instance Info</a>
            </div>

          </div>
        );
      }

    });

  });
