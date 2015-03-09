/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'moment',
    'url',
    './ProjectResource.react',
    'showdown',
    'react-router'
  ],
  function (React, Backbone, moment, URL, ProjectResource, Showdown, Router) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var project = this.props.project,
            converter = new Showdown.converter(),
            description = project.get('description'),
            descriptionHtml = converter.makeHtml(description);

        if(project.id){
          var projectUrl = URL.projectResources({project: project});
          var projectCreationDate = moment(project.get('start_date')).format("MMM D, YYYY");

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
                                     count={project.get('instances').length}
                                     resourceType={"instances"}
                    />
                    <ProjectResource icon={"hdd"}
                                     count={project.get('volumes').length}
                                     resourceType={"volumes"}
                    />
                    <ProjectResource icon={"floppy-disk"}
                                     count={project.get('images').length}
                                     resourceType={"images"}
                    />
                  </ul>
                </div>
              </Router.Link>
            </li>
          );

        }else{
          return (
            <li>
              <a>
                <div>
                  <h2>{project.get('name')}</h2>
                  <time>{"Creating..."}</time>
                </div>
              </a>
            </li>
          );
        }

      }
    });

  });
