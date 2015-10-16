define(function (require) {

  var React = require('react/addons'),
    Backbone = require('backbone'),
    Router = require('react-router'),
    modals = require('modals'),
    Glyphicon = require('components/common/Glyphicon.react'),
    actions = require('actions'),
    stores = require('stores');

  return React.createClass({
    displayName: "SecondaryProjectNavigation",

    propTypes: {
      project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onDeleteProject: function (e) {
      e.preventDefault();

      var project = this.props.project,
        projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
        projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project);

      if (projectInstances.length > 0 || projectVolumes.length > 0) {
        modals.ProjectModals.explainProjectDeleteConditions();
      } else {
        modals.ProjectModals.destroy(project);
      }
    },

    renderRoute: function (name, linksTo, icon, params) {
      return (
        <li key={name}>
          <Router.Link to={linksTo} params={params}>
            <Glyphicon name={icon}/>
            <span>{name}</span>
          </Router.Link>
        </li>
      )
    },

    render: function () {
      var project = this.props.project;

      return (
        <div>
          <div className="secondary-nav">
            <div className="container">

              <div className="project-name">
                <h1>
                  {project.get('name')}
                </h1>
              </div>

              <ul className="secondary-nav-links">
                {this.renderRoute("Resources", "project-resources", "th", {projectId: project.id})}
                {this.renderRoute("Details", "project-details", "list-alt", {projectId: project.id})}
              </ul>

              <ul className="options-bar navbar-nav navbar-right">
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                    <i className="glyphicon glyphicon-cog"/>
                    Options
                    <b className="caret"></b>
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#" className="danger" onClick={this.onDeleteProject}>
                        <i className="glyphicon glyphicon-trash"/>
                        Delete Project
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>

            </div>
          </div>
        </div>
      );
    }

  });

});
