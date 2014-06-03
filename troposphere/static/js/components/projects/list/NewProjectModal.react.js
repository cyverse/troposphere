/** @jsx React.DOM */

define(
  [
    'react',
    'controllers/projects',
    'components/mixins/modal',
    'actions/projects',
    'models/project'
  ],
  function (React, ProjectController, ModalMixin, ProjectActions, Project) {

    return React.createClass({
      mixins: [ModalMixin],

      getInitialState: function () {
        return {
          projectName: "",
          projectDescription: ""
        };
      },

      renderTitle: function () {
        return "Create Project";
      },

      renderBody: function () {

        var inputOnChange = function (e) {
          this.setState({'projectName': e.target.value});
        }.bind(this);

        var textareaOnChange = function (e) {
          this.setState({'projectDescription': e.target.value});
        }.bind(this);

        var onSubmit = function (e) {
          e.preventDefault();
        };

        return (
          <form role='form' onSubmit={this.onSubmit}>
            <div className='form-group'>
              <label htmlFor='project-name'>Project Name</label>
              <input type='text' className='form-control' id='project-name' onChange={this.inputOnChange}/>
            </div>
            <div className='form-group'>
              <label htmlFor='project-description'>Description</label>
              <textarea type='text' className='form-control' id='project-description' rows="7" onChange={this.textareaOnChange}/>
            </div>
          </form>
        );
      },

      createProject: function () {
//        ProjectController.create(this.state.projectName,
//            this.state.projectDescription).then(function (model) {
//            this.props.projects.add(model);
//            this.close();
//          }.bind(this)
//        );
        var project = new Project({
          name: this.state.projectName,
          description: this.state.projectDescription
        });
        ProjectActions.create(project);
      },

      renderFooter: function () {
        return (
          <button className="btn btn-primary" onClick={this.createProject}>Create</button>
        );
      }

    });

  });
