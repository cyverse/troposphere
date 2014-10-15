/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/projects/common/SecondaryProjectNavigation.react',
    'showdown',
    'actions/ProjectActions'
  ],
  function (React, Backbone, SecondaryProjectNavigation, Showdown, ProjectActions) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      renderDescription: function(){
        var project = this.state.project;
        var description = project.get('description');
        var converter = new Showdown.converter();
        var projectHtml;

        if(description) {
          if (this.state.isEditing) {
            return (
              <EditableInputField text={this.state.title} onDoneEditing={this.onDoneEditing}/>
            );
          } else {
            projectHtml = converter.makeHtml(description);
            return (
              <span dangerouslySetInnerHTML={{__html: projectHtml}}/>
            );
          }
        }
      },

      render: function () {
        var project = this.props.project;
        var converter = new Showdown.converter();
        var projectHtml = converter.makeHtml(project.get('description'));

        return (
          <div className="project-details">
            <SecondaryProjectNavigation project={this.props.project} currentRoute="details"/>
            <div className="container">
              <div>
                <div className="project-info-segment">
                  <h4>Created</h4>
                  <p>{project.get('start_date').format("MMMM Do, YYYY")}</p>
                </div>
                <div className="project-info-segment">
                  <h4>Description</h4>
                  <span dangerouslySetInnerHTML={{__html: projectHtml}}/>
                </div>
                <div className="project-info-segment">
                  <h4>Principal Investigator</h4>
                </div>
                <div className="project-info-segment">
                  <h4>Contributors</h4>
                </div>
                <div className="project-info-segment">
                  <h4>Tags</h4>
                </div>
                <div className="project-info-segment">
                  <h4>Funding Source and Agency</h4>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
