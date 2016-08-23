import React from 'react';
import $ from 'jquery';
import Backbone from 'backbone';
import SecondaryProjectNavigation from 'components/projects/common/SecondaryProjectNavigation.react';
import actions from 'actions';
import InputField from './InputField.react';
import TextAreaField from './HtmlTextAreaField.react';
import ViewDetails from './ViewDetails.react';
import EditDetails from './EditDetails.react';

export default React.createClass({
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
