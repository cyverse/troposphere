/** @jsx React.DOM */

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

      cancel: function(){
        this.hide();
      },

      confirm: function (reboot_type) {
        this.hide();
        this.props.onConfirm(reboot_type);
      },
      confirmReboot: function () {
        this.hide();
        this.props.onConfirm("SOFT");
      },
      confirmHardReboot: function () {
        this.hide();
        this.props.onConfirm("HARD");
      },

      //
      // Render
      // ------
      //

      renderBody: function(){
        return (
          <div>
            <p className='alert alert-warning'>
              <Glyphicon name='warning-sign'/>
              {" "}
              <strong>WARNING</strong>
              {" Rebooting an instance will cause it to temporarily shut down and become inaccessible during that time."}
            </p>
            <p>{"A 'Reboot' will send an 'ACPI Restart' request to the VM that will start the reboot process for your VM."}</p>
            <p>{"If your VM does not respond to a 'Reboot', there is also the option to send a 'Hard Reboot' which will forcibly restart your VM."}</p>
            <p>{"Select one of the two options below to reboot your instance."}</p>
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
                  <button type="button" className="btn btn-primary" onClick={this.confirmReboot}>
                    Reboot
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirmHardReboot}>
                    Hard Reboot
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
