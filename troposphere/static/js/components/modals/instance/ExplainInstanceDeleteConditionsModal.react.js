
define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react'
  ],
  function (React, BootstrapModalMixin) {

    return React.createClass({
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

      renderAttachedVolumes: function (volume) {
        return (
          <li><strong>{volume.get('name')}</strong></li>
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
                  "Instances can only be deleted if they have no volumes attached to them."
                }
              </p>

              <p>
                {
                  "This instance currently has the following volumes attached to it:"
                }
              </p>
              <ul>
                {this.props.attachedVolumes.map(this.renderAttachedVolumes)}
              </ul>
              <p>{"Once you detach the above volumes you will be able to delete this instance."}</p>
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
                  <strong>Instance Delete Conditions</strong>
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
