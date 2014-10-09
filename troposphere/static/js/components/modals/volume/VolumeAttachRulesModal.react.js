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
          <form role='form'>
            <div className='form-group'>
              <p>
                <strong>Uh oh! </strong>
                {
                  "It looks like you don't have any instances in this project. Volumes can only be attached " +
                  "to instances in the same project, so you'll need to "
                }
                <a href="https://pods.iplantcollaborative.org/wiki/display/atmman/Launching+a+New+Instance">create an instance</a>
                {
                  " or move an existing instance into this project before you can attach the volume."
                }
              </p>
            </div>
          </form>
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
