/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/ButtonDropdown.react',
    'actions/ProjectActions'
  ],
  function (React, ButtonDropdown, ProjectActions) {

    return {
      handleMove: function (destination, e) {
        e.preventDefault();
        var model = this.props.model;
        var source = this.props.project;
        ProjectActions.moveProjectItemTo(source, model, destination);
      },

      renderAction: function () {
        var self = this;
        var items = this.props.projects
          .filter(function (project) {
            return project != self.props.project;
          })
          .map(function (project) {
            return (
              <li key={project.id || project.cid}>
                <a href="#" onClick={self.handleMove.bind(null, project)}>
                  {project.get('name')}
                </a>
              </li>
            );
          });

        return (
          <div>
            <ButtonDropdown buttonContent="Move" disabled={items.length == 0}>
              {items}
            </ButtonDropdown>
          </div>
        );
      },

      render: function () {
        return (
          <li className={"project-item row " + this.getClassName()}>
            <div className="project-item-name col-md-5">
              {this.renderName()}
            </div>
            <div className="project-item-details col-md-5">
              {this.renderDetails()}
            </div>
            <div className="project-item-action col-md-2">
              {this.renderAction()}
            </div>
          </li>
        );
      }
    };

  });
