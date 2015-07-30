/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onCancel: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired
      },

      getInitialState: function () {
        var project = this.props.project;

        return {
          name: project.get('name'),
          description: project.get('description')
        }
      },

      handleCancel: function () {
        this.props.onCancel();
      },

      handleSave: function (description) {
        this.props.onSave({
          name: this.state.name,
          description: this.state.description
        });

        //actions.ProjectActions.updateProjectAttributes(this.props.project, {description: description})
      },

      handleNameChange: function (e) {
        var text = e.target.value;
        this.setState({name: text});
      },

      handleDescriptionChange: function (e) {
        var text = e.target.value;
        this.setState({description: text});
      },

      // ------
      // Render
      // ------

      render: function () {
        var project = this.props.project;

        return (
          <div className="edit-details">
            <div className="project-info-segment row" style={{marginTop:"62px"}}>
              <h4 className="col-md-3">Name</h4>
              <input type="text"
                     defaultValue={this.state.name}
                     onKeyUp={this.handleNameChange}
                />
            </div>

            <div className="project-info-segment row">
              <h4 className="col-md-3">Created</h4>

              <p className="col-md-9">{project.get('start_date').format("MMMM Do, YYYY")}</p>
            </div>

            <div className="project-info-segment row">
              <h4 className="col-md-3">Description</h4>
              <textarea type="text"
                        defaultValue={this.state.description}
                        onKeyUp={this.handleDescriptionChange}
                />
            </div>

            <div className="buttons">
              <button className="btn btn-default cancel-button" onClick={this.handleCancel}>Cancel</button>
              <button className="btn btn-primary save-button" onClick={this.handleSave}>Save</button>
            </div>
          </div>
        );
      }

    });

  });
