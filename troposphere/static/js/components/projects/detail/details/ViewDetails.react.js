/** @jsx React.DOM */

define(
  [
    'react',
    'jquery',
    'backbone',
    'components/projects/common/SecondaryProjectNavigation.react',
    'actions',
    './InputField.react',
    './HtmlTextAreaField.react'
  ],
  function (React, $, Backbone, SecondaryProjectNavigation, actions, InputField, TextAreaField) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      // ------
      // Render
      // ------

      renderName: function(project){
        return (
          <div className="project-info-segment row">
            <h4 className="col-md-3">Name</h4>
            <p className="col-md-9">{project.get('name')}</p>
          </div>
        );
      },

      renderDateCreated: function(project){
        return (
          <div className="project-info-segment row">
            <h4 className="col-md-3">Created</h4>
            <p className="col-md-9">{project.get('start_date').format("MMMM Do, YYYY")}</p>
          </div>
        );
      },

      renderDescription: function(project){
        return (
          <div className="project-info-segment row">
            <h4 className="col-md-3">Description</h4>
            <p className="col-md-9">{project.get('description')}</p>
          </div>
        )
      },

      render: function () {
        var project = this.props.project;

        return (
          <div>
            {this.renderName(project)}
            {this.renderDateCreated(project)}
            {this.renderDescription(project)}
          </div>
        );
      }

    });

  });
