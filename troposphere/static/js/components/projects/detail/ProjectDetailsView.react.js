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
              <div className="sub-menu col-md-3">
                <button className="btn btn-primary">Create</button>
                <ul>
                  <li className="active"><a href="#">Instances</a></li>
                  <li><a href="#">Volumes</a></li>
                </ul>
              </div>
              <div className="col-md-9">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <td>2</td>
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
          </div>
        );
      }

    });

  });
