/** @jsx React.DOM */

define(
  [
    'react',
    'jquery',
    'backbone',
    'components/projects/common/SecondaryProjectNavigation.react',
    'showdown',
    'actions/ProjectActions',
    './InputField.react'
  ],
  function (React, $, Backbone, SecondaryProjectNavigation, Showdown, ProjectActions, InputField) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onSaveDescription: function(e){
        var projectDescription = $(this.getDOMNode()).find("textarea")[0].value;

      },

      // ------
      // Render
      // ------

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

      renderDateCreated: function(project){
        return (
          <div className="project-info-segment">
            <h4>Created</h4>
            <p>{project.get('start_date').format("MMMM Do, YYYY")}</p>
          </div>
        );
      },

      renderDescription: function(project){
        var converter = new Showdown.converter();
        var projectHtml = converter.makeHtml(project.get('description'));

        return (
          <div className="project-info-segment">
            <h4>Description</h4>
            <span dangerouslySetInnerHTML={{__html: projectHtml}}/>
          </div>
        )
      },

      renderEditableDescription: function(project){
        return (
          <div className="project-info-segment">
            <h4>Description</h4>
            <div style={{"display": "inline-block"}}>
              <textarea style={{"width":"450px", "maxWidth":"450px", "height":"150px"}}>{project.get('description')}</textarea>
              <button className="btn btn-small btn-default"
                      style={{"display": "block", "padding":"5px 10px"}}
                      onClick={this.onSaveDescription}>
                Save changes
              </button>
            </div>
          </div>
        )
      },

      renderPrincipalInvestigator: function(){
        return (
          <div className="project-info-segment">
            <h4>Principal Investigator</h4>
            <InputField title="__Not_A_Database_Field__"
                        canEditTitle={true}
                        onTitleChanged={function(){}}/>
          </div>
        )
      },

      renderContributors: function(){
        return (
          <div className="project-info-segment">
            <h4>Contributors</h4>
            <InputField title="__Not_A_Database_Field__"
                        canEditTitle={true}
                        onTitleChanged={function(){}}/>
          </div>
        );
      },

      renderTags: function(){
        return (
          <div className="project-info-segment">
            <h4>Tags</h4>
            <InputField title="__Not_A_Database_Field__"
                        canEditTitle={true}
                        onTitleChanged={function(){}}/>
          </div>
        )
      },

      renderFundingSource: function(){
        return (
          <div className="project-info-segment">
            <h4>Funding Source/Agency</h4>
            <InputField title="__Not_A_Database_Field__"
                        canEditTitle={true}
                        onTitleChanged={function(){}}/>
          </div>
        );
      },

      renderEditableInput: function(){
        return (
          <div className="project-info-segment">
            <h4>Project Field</h4>
            <InputField title="my text"
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
                {this.renderEditableDescription(project)}
                {this.renderPrincipalInvestigator()}
                {this.renderContributors()}
                {this.renderTags()}
                {this.renderFundingSource()}
                {this.renderEditableInput()}
              </div>
            </div>
          </div>
        );
      }

    });

  });
