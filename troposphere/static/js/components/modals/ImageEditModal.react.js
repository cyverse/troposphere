define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'stores',
    'globals',
    'actions/ImageActions'
  ],
  function (React, BootstrapModalMixin, stores, globals, ImageActions) {

    return React.createClass({
      mixins: [BootstrapModalMixin],

      //
      // Mounting & State
      // ----------------
      //

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

      isSubmittable: function(){
        return true;
      },

      render: function () {
        var image = this.props.image;
        
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content badge-modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Edit image- {image.get('name')}</strong>
                </div>
                <div className="modal-body">
                  WHAT
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.cancel}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.confirm}
                          disabled={!this.isSubmittable()}>
                    Submit changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });

  });
