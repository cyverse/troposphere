/** @jsx React.DOM */

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

      cancel: function(){
        this.hide();
      },

      confirm: function () {
        this.hide();
      },

      //
      // Render
      // ------
      //

      renderBody: function(){
        return (
          <div role='form'>
            <div className='form-group'>
              <p>
                <strong>Uh oh! </strong>
                {
                  "It looks like you don't have any instances in this project that you can attach the volume " +
                  "to. Volumes can only be attached to instances that are in the same project and on the same " +
                  "provider as the volume."
                }
              </p>
              <p>
                {
                  "If you'd like to attach this volume to an instance, you'll first need to "
                }
                <a href="https://pods.iplantcollaborative.org/wiki/display/atmman/Launching+a+New+Instance">create an instance</a>
                {
                  " on the same provider or move an existing instance into this project."
                }
              </p>
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
                  <strong>Volume Attach Rules</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={this.confirm}>
                    Okay
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
