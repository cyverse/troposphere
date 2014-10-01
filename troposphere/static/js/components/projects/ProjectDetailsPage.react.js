/** @jsx React.DOM */

define(
  [
    'react',
    'stores',
    './detail/details/ProjectDetailsView.react'
  ],
  function (React, stores, ProjectDetailsView) {

    function getState(projectId) {
      return {
        project: stores.ProjectStore.get(projectId)
      };
    }

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        projectId: React.PropTypes.string.isRequired
      },

      getInitialState: function() {
        return getState(this.props.projectId);
      },

      updateState: function() {
        if (this.isMounted()) this.setState(getState(this.props.projectId))
      },

      componentDidMount: function () {
        stores.ProjectStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
        stores.ProjectStore.removeChangeListener(this.updateState);
      },

      //
      // Render
      // ------
      //

      render: function () {
        var project = this.state.project;
        var h4Style = {
          "color": "#5A5A5A",
          "font-size": "18px",
          "margin-bottom": "5px"
        };

        var pStyle = {
          "font-size": "15px"
        };

        var divStyle= {
          "margin-top": "22px"
        };

        if (project) {
          return (
            <ProjectDetailsView project={project}>
              <div>
                <div style={divStyle}>
                  <h4 style={h4Style}>Created</h4>
                  <p style={pStyle}>{project.get('start_date').format("MMMM Do, YYYY")}</p>
                </div>
                <div style={divStyle}>
                  <h4 style={h4Style}>Description</h4>
                  <p style={pStyle}>{project.get('description')}</p>
                </div>
              </div>
            </ProjectDetailsView>
          );
        }

        return (
          <div className="loading"></div>
        );
      }

    });

  });
