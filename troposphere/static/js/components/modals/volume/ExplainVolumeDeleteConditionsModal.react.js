define(function (require) {
    var React = require('react'),
      BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react');

    return React.createClass({
      displayName: "ExplainVolumeDeleteConditionsModal",

      mixins: [BootstrapModalMixin],

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
      // Render Helpers
      // --------------
      //

      renderAttachedInstance: function (instance) {
        return (
          <li><strong>{instance.get('name')}</strong></li>
        )
      },

      //
      // Render
      // ------
      //

      renderBody: function () {
        return (
          <div role='form'>
            <div className='form-group'>
              <p>
                {
                  "Volumes cannot be deleted while they are attached to an instance."
                }
              </p>

              <p>
                {
                  "This volume is currently attached to the following instance:"
                }
              </p>
              <ul>
                {this.renderAttachedInstance(this.props.instance)}
              </ul>
              <p>{"Once you detach the volume from the above instance you will be able to delete it."}</p>
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
                  <strong>Volume Delete Conditions</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={this.confirm}>
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
