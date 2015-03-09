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
              <p className="alert alert-info">
                <i className="glyphicon glyphicon-info-sign"/>
                <strong>Uh-oh! </strong>
                {
                  "It looks like you're trying to delete this project. However, we don't currently support " +
                  "deleting projects that have resources in them."
                }
              </p>
              <p>
                Before you can delete this project, you first need to either <strong>DELETE</strong> all resources in this project <span style={{"textDecoration":"underline"}}>or</span> <strong>MOVE</strong> them into another project.
              </p>
              <p>Once there are no resources left in the project, you'll be able to delete it.</p>
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
                  <strong>Project Delete Conditions</strong>
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
