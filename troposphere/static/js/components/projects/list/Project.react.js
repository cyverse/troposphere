/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'moment',
    'url',
    './ProjectResource.react',
    'showdown',
    'react-router',
    'stores'
  ],
  function (React, Backbone, moment, URL, ProjectResource, Showdown, Router, stores) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var project = this.props.project,
            converter = new Showdown.converter(),
            description = project.get('description'),
            descriptionHtml = converter.makeHtml(description),
            projectInstances = stores.ProjectInstanceStore.getInstancesFor(project),
            projectVolumes = stores.ProjectVolumeStore.getVolumesFor(project),
            projectCreationDate;

        if(!project.id || !projectInstances || !projectVolumes) {
          return (
            <li>
              <a>
                <div>
                  <h2>{project.get('name')}</h2>
                  <div className="loading" style={{"margin-top": "65px"}}/>
                </div>
              </a>
            </li>
          );
        }

        projectCreationDate = moment(project.get('start_date')).format("MMM D, YYYY");

        return (
          <li className="project-card">
            <Router.Link to="project-resources" params={{projectId: project.id}}>
              <div style={{"position": "relative"}}>
                <div className="content">
                  <h2>{project.get('name')}</h2>
                  <time>{"Created " + projectCreationDate}</time>
                  <div className="description" dangerouslySetInnerHTML={{__html: descriptionHtml}}/>
                </div>
                <ul className="project-resource-list">
                  <ProjectResource icon={"tasks"}
                                   count={projectInstances.length}
                                   resourceType={"instances"}
                  />
                  <ProjectResource icon={"hdd"}
                                   count={projectVolumes.length}
                                   resourceType={"volumes"}
                  />
                  <ProjectResource icon={"floppy-disk"}
                                   count={0}
                                   resourceType={"images"}
                  />
                </ul>
              </div>
            </Router.Link>
          </li>
        );
      }
    });

  });
