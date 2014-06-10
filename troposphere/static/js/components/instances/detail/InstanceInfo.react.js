/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      render: function () {

        return (
          <div className="instance-info-section">

            <div className="instance-image">
              <a href="/application/images/9ab516c9-c39f-595e-a990-977642da4c0e">
                <img src="//www.gravatar.com/avatar/918bf82f238c6c264fc7701e1ff61363?d=identicon&amp;s=100" width="100" height="100"/>
              </a>
            </div>

            <div className="instance-info">
              <h4 className="instance-name">Instance Name</h4>
              <div className="instance-launch-date">Launched on March 3, 2014</div>
              <div className="instance-tags">Instance Tags:</div>
              <ul className="tags">
                <li className="tag"><a href="#">Batman</a></li>
                <li className="tag"><a href="#">Bruce Wayne</a></li>
                <li className="tag"><a href="#">Superman</a></li>
                <li className="tag"><a href="#">Ironman</a></li>
                <li className="tag"><a href="#">Black Widow</a></li>
                <li className="tag"><a href="#">HULK SMASH!!</a></li>
              </ul>
            </div>

            <div className="edit-instance-link">
              <a href="#">Edit Instance Info</a>
            </div>

          </div>
        );
      }

    });

  });
