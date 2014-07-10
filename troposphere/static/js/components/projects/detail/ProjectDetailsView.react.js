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
          <div>

            <div className="secondary-nav">
              <div className="container">
                <div className="project-name">
                  <h1>{this.props.project.get('name')}</h1>
                </div>
                <ul className="secondary-nav-links">
                  <li><a href="#">Overview</a></li>
                  <li className="active"><a href="#">Resources</a></li>
                  <li><a href="#">Activity</a></li>
                </ul>
              </div>
            </div>

            <div className="container">

              <div className="sub-menu col-md-2">
                <button className="btn btn-primary">Create</button>
                <ul>
                  <li className="active"><a href="#">Instances</a></li>
                  <li><a href="#">Volumes</a></li>
                </ul>
              </div>

              <div className="col-md-10">

                <div className="button-bar">
                  <button className="btn btn-default">
                    <i className="glyphicon glyphicon-folder-open"/>
                  </button>
                </div>

                <div className="row">

                  <div className="scrollable-content col-md-9">
                    <div>
                      <div className="header">
                        <i className="glyphicon glyphicon-tasks"></i>
                        <h2>Instances</h2>
                      </div>
                      <table className="table">
                        <thead>
                          <tr>
                            <th><input type="checkbox"/></th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><input type="checkbox"/></td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <td><input type="checkbox"/></td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                  </div>

                  <div className="side-panel col-md-3">
                    <div className="header">
                      <span className="title">Details</span>
                    </div>
                    <ul>
                      <li>
                        <span class="instance-detail-label">Launched</span>
                        <span class="instance-detail-value">
                          <time title="2014-07-01T12:12:19-07:00" datetime="2014-07-01T19:12:19+00:00">Jul 1, 2014 (9 days ago)</time>
                        </span>
                      </li>
                      <li>
                        <span class="instance-detail-label">ID</span>
                        <span class="instance-detail-value">9a1f18c7-fe6d-4d2f-85ee-c3bfc572c6a2</span>
                      </li>
                    </ul>
                  </div>

                </div>

              </div>
            </div>
          </div>
        );
      }

    });

  });
