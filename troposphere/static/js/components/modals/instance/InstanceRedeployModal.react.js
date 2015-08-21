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

      confirm: function () {
        this.hide();
        this.props.onConfirm();
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
              <strong>NOTE</strong>
              {" Redeploying an instance will allow you to fix intances that show up as 'active - deploy_error'. If after executing a 'redeploy' you find that your VM returns to the deploy_error state, please contact support."}
            </p>
            <p>{"Would you like to redeploy this instance?"}</p>
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
                  <strong>Redeploy Instance</strong>
                </div>
                <div className="modal-body">
                  {this.renderBody()}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}>
                    Yes, Redeploy Instance
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
