/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './SubMenu.react',
    './ProjectContent.react'
  ],
  function (React, Backbone, SubMenu, ProjectContent) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <div className="container">
            <table>
              <tbody>
                <tr>
                  <td className="td-sub-menu">
                    <SubMenu/>
                  </td>
                  <td className="td-project-content">
                    <ProjectContent project={this.props.project}/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }

    });

  });
