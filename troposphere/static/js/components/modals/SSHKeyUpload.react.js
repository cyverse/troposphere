var React = require('react');
var BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react');
var SSHKeyStore = require('stores/SSHKeyStore');

module.exports = React.createClass({

      getInitialState: function() {
          return {
              keyName: "",
              pubKey: "",
          }
      },

      mixins: [BootstrapModalMixin],

      isSubmittable: function(){
          return this.state.keyName && this.state.pubKey;
      },

      updateKeyName: function(event) {
        this.setState({"keyName": event.target.value});
      },

      updatePublicKey: function(event) {
        this.setState({"pubKey": event.target.value});
      },

      componentDidMount: function () {
          stores.SSHKeyStore.addChangeListener(this.updateState);
      },

      componentWillUnmount: function () {
          stores.SSHKeyStore.removeChangeListener(this.getInitialState);
      },


      addPublicKey: function() {
          SSHKeyStore.models.create({
              atmo_user: this.props.user,
              name: this.state.keyName,
              pub_key: this.state.pubKey,
          }, {
              success: function() {
                  SSHKeyStore.emitChange();
              },
          });
      },

      onSubmit: function() {
          this.addPublicKey();
          this.hide();
      },

      render: function () {
          var self = this;
        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content badge-modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>Add a public SSH key</strong>
                </div>
                <div className="modal-body">

                              <div className='form-group'>
                                <label className="control-label">Key Name</label>

                                <div>
                                  <input type="text" className="form-control" onChange={this.updateKeyName}/>
                                </div>
                              </div>
                              <div className='form-group'>
                                <label className="control-label">Public Key</label>

                                <div>
                                    <textarea className="form-control" rows="6" onChange={this.updatePublicKey}/>
                                </div>
                              </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={this.hide}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={this.onSubmit} disabled={!this.isSubmittable()}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

});
