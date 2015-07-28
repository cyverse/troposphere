
define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react'
  ],
  function (React, Backbone, BootstrapModalMixin) {

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      isSubmittable: function () {
        return true;
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function () {
        this.hide();
      },

      confirm: function () {
        this.hide();
        this.props.onConfirm();
      },

      //
      // Render
      // ------
      //

      renderBody: function () {
        var project = this.props.project;
        return (
          <p>
            {"Are you sure you want to delete the project "}
            <strong>{project.get('name')}</strong>
            {"?"}
          </p>
        );
      },

      render: function () {

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Delete Project</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}
                          disabled={!this.isSubmittable()}>
                    Yes, delete the project
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
