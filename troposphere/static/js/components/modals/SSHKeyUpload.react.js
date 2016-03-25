import React from 'react';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';
import stores from 'stores';

export default React.createClass({

    getInitialState: function() {
        return {
            keyName: "",
            pubKey: "",
        }
    },

    mixins: [BootstrapModalMixin],

    updateKeyName: function(event) {
        this.setState({
            "keyName": event.target.value.trim()
        });
    },

    updatePublicKey: function(event) {
        this.setState({
            "pubKey": event.target.value.trim()
        });
    },

    componentDidMount: function() {
        stores.SSHKeyStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.SSHKeyStore.removeChangeListener(this.getInitialState);
    },

    validateKey: function() {
        let parts = this.state.pubKey.split(/ +/);
        let lengthTest = parts.length == 2 || parts.length == 3
        let keyTypeTest = /^(ssh-dss|ecdsa-sha2-nistp256|ssh-ed25519|ssh-rsa)/.test(this.state.pubKey);

        return keyTypeTest && lengthTest;
    },

    isSubmittable() {
        return this.validateKey() && this.state.keyName.length > 0;
    },

    addPublicKey: function() {
        stores.SSHKeyStore.models.create({
            atmo_user: this.props.user,
            name: this.state.keyName,
            pub_key: this.state.pubKey,
        }, {
            success: function() {
                stores.SSHKeyStore.emitChange();
            },
        });
    },

    onSubmit: function() {
        this.addPublicKey();
        this.hide();
    },

    render: function() {
        // Only show the warning if the field has content
        let showKeyWarn = !this.validateKey() && this.state.pubKey.length > 0;
        let notSubmittable = !this.isSubmittable();

        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <strong>Add a public SSH key</strong>
                        </div>
                        <div style={{minHeight:"300px"}} className="modal-body">

                            <div className='form-group'>
                                <label className="control-label">Key Name</label>

                                <div>
                                    <input type="text" className="form-control" onChange={this.updateKeyName}/>
                                </div>
                            </div>
                            <div aria-invalid={showKeyWarn} className={"form-group " + (showKeyWarn? "has-error" : "")}>
                                <label className="control-label">Public Key</label>
                                <div>
                                    <textarea style={{minHeight:"200px"}} className="form-control" onChange={this.updatePublicKey}/>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={this.hide}>
                                Cancel
                            </button>
                            <button type="button" aria-invalid={notSubmittable} className="btn btn-primary" onClick={this.onSubmit} disabled={notSubmittable}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});
