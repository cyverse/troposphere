
define(
  [
    'react',
    'jquery',
    'backbone',
    'components/projects/common/SecondaryProjectNavigation.react',
    'actions',
    './InputField.react',
    './HtmlTextAreaField.react',
    './ViewDetails.react',
    './EditDetails.react'
  ],
  function (React, $, Backbone, SecondaryProjectNavigation, actions, InputField, TextAreaField, ViewDetails, EditDetails) {

    return React.createClass({
      displayName: "ProjectDetailsView",

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      getInitialState: function () {
        return {
          isEditing: false
        }
      },

      handleCancel: function () {
        this.setState({isEditing: false})
      },

      handleSave: function (params) {
        this.setState({isEditing: false});
        actions.ProjectActions.updateProjectAttributes(this.props.project, params)
      },

      handleEdit: function () {
        this.setState({isEditing: true})
      },

      // ------
      // Render
      // ------

      renderDetailsView: function (project) {
        return (
          <div className="container">
            <div className="row edit-link-row">
              <a className="edit-link" onClick={this.handleEdit}>
                Edit details
              </a>
            </div>
            <ViewDetails project={project}/>
          </div>
        )
      },

      renderEditDetailsView: function (project) {
        return (
          <div className="container">
            <EditDetails project={project}
                         onSave={this.handleSave}
                         onCancel={this.handleCancel}
              />
          </div>
        )
      },

      render: function () {
        var project = this.props.project,
          view;

        if (this.state.isEditing) {
          view = this.renderEditDetailsView(project);
        } else {
          view = this.renderDetailsView(project);
        }

        return view;
      }

    });

  });
