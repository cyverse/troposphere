/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'moment'
  ],
  function (React, Backbone, moment) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var project = this.props.project;

        if(project.id){
          var projectUrl = "/application/projects/" + project.id;
          var projectCreationDate = moment(project.get('start_date')).format("MMM D, YYYY");

          return (
            <li>
              <a href={projectUrl}>
                <div style={{"position": "relative"}}>
                  <h2>{project.get('name')}</h2>
                  <time>{"Created " + projectCreationDate}</time>
                  <ul className="project-resource-list">
                    <li>
                      <i className="glyphicon glyphicon-tasks"></i>
                      <span>{project.get('instances').length}</span>
                    </li>
                    <li>
                      <i className="glyphicon glyphicon-hdd"></i>
                      <span>{project.get('volumes').length}</span>
                    </li>
                    <li>
                      <i className="glyphicon glyphicon-floppy-disk"></i>
                      <span>{project.get('applications').length}</span>
                    </li>
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
