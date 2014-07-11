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
                <span className="instance-detail-label">Launched</span>
                <span className="instance-detail-value">
                  <time title="2014-07-01T12:12:19-07:00" datetime="2014-07-01T19:12:19+00:00">Jul 1, 2014 (9 days ago)</time>
                </span>
              </li>
              <li>
                <span className="instance-detail-label">ID</span>
                <span className="instance-detail-value">9a1f18c7-fe6d-4d2f-85ee-c3bfc572c6a2</span>
              </li>
            </ul>
          </div>
        );
      }

    });

  });
