/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/BootstrapModalMixin.react'
  ],
  function (React, Backbone, BootstrapModalMixin) {

    function getState() {
      return {
        feedback: null
      };
    }

    return React.createClass({
      mixins: [BootstrapModalMixin],

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      isSubmittable: function () {
        var hasFeedback = !!this.state.feedback;
        return hasFeedback;
      },

      //
      // Mounting & State
      // ----------------
      //

      getInitialState: function () {
        return getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
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
      // Custom Modal Callbacks
      // ----------------------
      //

      onFeedbackChange: function (e) {
        var newFeedback = e.target.value;
        this.setState({feedback: newFeedback});
      },


      //
      // Render
      // ------
      //

      renderResource: function (resource) {
        return (
          <li key={resource.id}>{resource.get('name')}</li>
        );
      },

      renderBody: function () {
        var project = this.props.project;
        return (
          <div role='form'>

            <div className='form-group'>
              <p>
                {"Are you experiencing a problem with your project or its resources? Let us know!"}
              </p>
              <label htmlFor='volumeSize'>Additional information</label>

              <p>
                {"Information about your project and any selected resources will be sent with your comments."}
              </p>
              <ul>
                <li><strong>{"Project: "}</strong>{project.get('name')}</li>
                {this.props.resources.map(this.renderResource)}
              </ul>

              <textarea type='text'
                        className='form-control'
                        rows="7"
                        value={this.state.feedback}
                        onChange={this.onFeedbackChange}
                />
            </div>

          </div>
        );
      },

      render: function () {
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Report Resources</strong>
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
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
