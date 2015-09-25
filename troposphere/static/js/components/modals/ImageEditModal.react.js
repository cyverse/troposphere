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

      getInitialState: function(){
        return{
          edits: {
            minMem: this.props.image.get('new_version_memory_min'),
            minCPU: this.props.image.get('new_version_cpu_min')
          }
        };
      },

      handleMemChange: function(e){
        this.setState({
          edits:{
            minMem: e.target.value,
            minCPU: this.state.edits.minCPU
          }
        });
      },

      handleStorageChange: function(e){
        this.setState({
          edits:{
            minMem: this.state.edits.minMem,
            minCPU: e.target.value
          }
        });
      },
      
      cancel: function(){
        this.hide();
      },

      confirm: function () {
        ImageActions.editRequirements(this.props.image, this.state.edits);
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
                  <strong>Edit image metadata - {image.get('new_application_name')}</strong>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="name" className="control-label">
                      Minimum memory (GB):
                    </label>
                  <div className="help-block">
                    Let other users know how much memory (RAM) is required to properly run an instance based on this image.
                  </div>
                  <input type="text" onChange={this.handleMemChange} value={this.state.edits.minMem} />
                  </div>
                <hr />
                  <div className="form-group">
                    <label htmlFor="name" className="control-label">
                      Minimum storage (GB):
                    </label>
                    <div className="help-block">
                      Let other users know how much storage is required to properly run an instance based on this image.
                    </div>
                    <input type="text" onChange={this.handleStorageChange} value={this.state.edits.minCPU} />
                  </div>
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
