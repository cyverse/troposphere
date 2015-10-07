
define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'components/common/Glyphicon.react'
  ],
  function (React, BootstrapModalMixin, Glyphicon) {

    return React.createClass({
      displayName: "InstanceSuspendModal",

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
              {" Suspending an instance will freeze its state, and the IP address may change when you resume the instance."}
            </p>

            <p>
              {'Suspending an instance frees up resources for other users and allows you to safely preserve the state of your instance without imaging. '}
              {'Your time allocation no longer counts against you in the suspended mode.'}
            </p>

            <p>
              {'Your resource usage charts will only reflect the freed resources once the instance\'s state is "suspended."'}
            </p>
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
                  <strong>Suspend Instance</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}>
                    Yes, suspend this instance
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
