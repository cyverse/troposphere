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

      onSaveDescription: function(description){
        actions.ProjectActions.updateProjectAttributes(this.props.project, {description: description})
      },

      // ------
      // Render
      // ------

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
            <TextAreaField title={project.get('description')}
                           canEditTitle={true}
                           onTitleChanged={this.onSaveDescription}/>
          </div>
        )
      },

      renderPrincipalInvestigator: function(){
        return (
          <div className="project-info-segment row">
            <h4 className="col-md-3">Principal Investigator</h4>
            <InputField title="__Not_A_Database_Field__"
                        canEditTitle={true}
                        onTitleChanged={function(){}}/>
          </div>
        )
      },

      renderContributors: function(){
        return (
          <div className="project-info-segment row">
            <h4 className="col-md-3">Contributors</h4>
            <InputField title="__Not_A_Database_Field__"
                        canEditTitle={true}
                        onTitleChanged={function(){}}/>
          </div>
        );
      },

      renderTags: function(){
        return (
          <div className="project-info-segment row">
            <h4 className="col-md-3">Tags</h4>
            <InputField title="__Not_A_Database_Field__"
                        canEditTitle={true}
                        onTitleChanged={function(){}}/>
          </div>
        )
      },

      renderFundingSource: function(){
        return (
          <div className="project-info-segment row">
            <h4 className="col-md-3">Funding Source/Agency</h4>
            <InputField title="__Not_A_Database_Field__"
                        canEditTitle={true}
                        onTitleChanged={function(){}}/>
          </div>
        );
      },

      render: function () {
        var project = this.props.project;

        return (
          <div className="project-details">
            <SecondaryProjectNavigation project={this.props.project} currentRoute="details"/>
            <div className="container">
              <div>
                {this.renderDateCreated(project)}
                {this.renderDescription(project)}
                {this.renderPrincipalInvestigator()}
                {this.renderContributors()}
                {this.renderTags()}
                {this.renderFundingSource()}
              </div>
            </div>
          </div>
        );
      }

    });

  });
