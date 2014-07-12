/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <div className="side-panel">
            <div className="header">
              <span className="title">Details</span>
            </div>
            <ul>
              <li>
                <span>Launched</span>
                <span>
                  <time>Jul 1, 2014 (9 days ago)</time>
                </span>
              </li>
              <li>
                <span>ID</span>
                <span>9a1f18c7-fe6d-4d2f-85ee-c3bfc572c6a2</span>
              </li>
            </ul>
          </div>
        );
      }

    });

  });
