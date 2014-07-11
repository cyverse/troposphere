/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceTable.react',
    './VolumeTable.react',
    './PreviewPanel.react',
    './SubMenu.react',
    './ButtonBar.react'
  ],
  function (React, Backbone, InstanceTable, VolumeTable, PreviewPanel, SubMenu, ButtonBar) {

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
                    <div className="project-content">
                      <ButtonBar/>
                      <div className="resource-list">
                        <div className="scrollable-content">
                          <InstanceTable/>
                          <VolumeTable/>
                        </div>
                        <PreviewPanel/>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        );
      }

    });

  });
