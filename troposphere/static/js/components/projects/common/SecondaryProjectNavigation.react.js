/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/SecondaryNavigation.react',
    'actions/ProjectActions',
    'stores'
  ],
  function (React, Backbone, SecondaryNavigation, ProjectActions, stores) {

    return React.createClass({

      propTypes: {
        currentRoute: React.PropTypes.string.isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onTitleChanged: function(text){
        ProjectActions.updateProjectAttributes(this.props.project, {name: text});
      },

      onDeleteProject: function(e){
        e.preventDefault();

        var projectInstances = stores.InstanceStore.getInstancesInProject(this.props.project);
        var projectVolumes = stores.VolumeStore.getVolumesInProject(this.props.project);

        if(projectInstances.length > 0 || projectVolumes.length > 0){
          ProjectActions.explainProjectDeleteConditions();
        }else{
          ProjectActions.destroy(this.props.project);
        }
      },

      render: function () {
        var routes = [
          {
            name: "Resources",
            href: "/application/projects/" + this.props.project.id + "/resources",
            icon: "th"
          },
          {
            name: "Details",
            href: "/application/projects/" + this.props.project.id,
            icon: "list-alt"
          }
        ];

        var additionalContent = (
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
        );

        return (
          <div>
            <SecondaryNavigation title={this.props.project.get('name')}
                                 routes={routes}
                                 currentRoute={this.props.currentRoute}
                                 canEditTitle={false}
                                 onTitleChanged={this.onTitleChanged}
                                 additionalContent={additionalContent}
            />
          </div>
        );

      }

    });

  });
