/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'moment',
    'url',
    './ProjectResource.react'
  ],
  function (React, Backbone, moment, URL, ProjectResource) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var project = this.props.project;

        if(project.id){
          var projectUrl = URL.projectResources({project: project});
          var projectCreationDate = moment(project.get('start_date')).format("MMM D, YYYY");

          return (
            <li>
              <a href={projectUrl}>
                <div style={{"position": "relative"}}>
                  <h2>{project.get('name')}</h2>
                  <time>{"Created " + projectCreationDate}</time>
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
                                     count={project.get('applications').length}
                                     resourceType={"images"}
                    />
                  </ul>
                </div>
              </a>
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
