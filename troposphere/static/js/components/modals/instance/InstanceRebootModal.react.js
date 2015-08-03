
define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'components/common/Glyphicon.react'
  ],
  function (React, BootstrapModalMixin, Glyphicon) {

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
      // Render
      // ------
      //

      renderBody: function () {
        return (
          <div>
            <p className='alert alert-warning'>
              <Glyphicon name='warning-sign'/>
              {" "}
              <strong>WARNING</strong>
              {" Rebooting an instance will cause it to temporarily shut down and become inaccessible during that time."}
            </p>

            <p>{"Would you like to reboot this instance?"}</p>
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
                  <strong>Reboot Instance</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}>
                    Yes, reboot instance
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
