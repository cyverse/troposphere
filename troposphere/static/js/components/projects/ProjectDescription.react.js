define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      getInitialState: function () {
        return {
          editing: false,
          saving: false
        };
      },

      startEditing: function (e) {
        e.preventDefault();
        this.setState({editing: true});
      },

      updateDescription: function (e) {
        this.props.project.set('description', e.target.value);
      },

      save: function () {
        this.setState({saving: true}, function () {
          this.props.project.save(null, {
            patch: true,
            wait: true,
            success: function () {
              this.setState({editing: false, saving: false});
            }.bind(this)
          });
        }.bind(this));
      },

      renderEditing: function () {
        var project = this.props.project;
        return [
          <div className="form-group">
            <textarea className={'form-control'} rows="7" onChange={this.updateDescription}>
              {project.get('description')}
            </textarea>
          </div>,
          <p>
            <button className="btn btn-primary" onClick={this.save} disabled={this.state.saving}>
              {this.state.saving ? "Saving..." : "Save"}
            </button>
          </p>
        ];
      },

      renderNotEditing: function () {
        var project = this.props.project;
        var description = project.get('description') || <em>No description</em>;
        return [
          <a href="#" onClick={this.startEditing}>Edit Description</a>,
          <p>{description}</p>
        ];
      },

      render: function () {
        var content;
        if (this.state.editing) {
          content = this.renderEditing();
        } else {
          content = this.renderNotEditing();
        }

        return (
          <div className="project-description">{content}</div>
        );
      }

    });

  });
