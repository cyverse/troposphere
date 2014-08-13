/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'actions/ProjectActions',
    'moment'
  ],
  function (React, Backbone, ProjectActions, moment) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onAddResourceToProject: function(e){
        e.preventDefault();
        ProjectActions.addResourceToProject(this.props.project);
      },

      render: function () {
        var project = this.props.project;

        if(project.id){
          var projectUrl = "/application/projects/" + project.id;
          var projectCreationDate = moment(project.get('start_date')).format("MMM D, YYYY");

          return (
            <li>
              <a href={projectUrl}>
                <div>
                  <h2>{project.get('name')}</h2>
                  <time>{"Created " + projectCreationDate}</time>
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
