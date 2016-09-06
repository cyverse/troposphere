import React from 'react';
import ModalHelpers from 'components/modals/ModalHelpers';
import SSHKeyUpload from 'components/modals/SSHKeyUpload.react';
import actions from 'actions';
import stores from 'stores';

export default React.createClass({

    getInitialState: function() {
        var profile = stores.ProfileStore.get();
        return {
            profile: profile,
            ssh_keys: stores.SSHKeyStore.getAll(),
            use_ssh_keys: profile.get('settings')['use_ssh_keys'],
        };
    },

    updateState: function() {
        this.setState(this.getInitialState());
    },

    componentDidMount: function() {
        stores.ProfileStore.addChangeListener(this.updateState);
        stores.SSHKeyStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function() {
        stores.ProfileStore.removeChangeListener(this.updateState);
        stores.SSHKeyStore.removeChangeListener(this.updateState);
    },

    handleChangeSSHPreference: function(event) {
        var isChecked = event.target.checked;
        // Update the store
        actions.ProfileActions.updateProfileAttributes(this.state.profile, {
            use_ssh_keys: isChecked
        });
        // Optimistically update ui
        this.setState({
            use_ssh_keys: isChecked
        });
    },

    destroySSHKey: function(sshKey) {

        // EmitChange is responsible for triggering the rerender, which
        // happens after the network request.

        // Optimistically delete the key
        stores.SSHKeyStore.remove(sshKey);
        sshKey.destroy({
            success: function() {
                stores.SSHKeyStore.emitChange();
            },
            error: function() {
                // Re-add the key to store if delete failed
                stores.SSHKeyStore.add(sshKey);
                stores.SSHKeyStore.emitChange();
            }
        });
    },

    launchSSHKeyUploadModal: function(user) {
        ModalHelpers.renderModal(SSHKeyUpload, {
            user: user
        }, function() {});
    },

    renderSSHKeyRow: function(sshKey) {
        return (
            <tr key={ sshKey.get( 'id') }>
                <td>{ sshKey.get('name') }</td>
                <td style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{ sshKey.get('pub_key').replace(/\n/g, " ") }</td>
                <td>
                    <a onClick={ this.destroySSHKey.bind(this, sshKey) }>
                        <i style={{ color: "crimson"}} className="glyphicon glyphicon-trash" />
                    </a>
                </td>
            </tr>
        );
    },

    render: function() {
        var profile = this.state.profile;
        var ssh_keys = this.state.ssh_keys;
        var use_ssh_keys = this.state.use_ssh_keys;

        return (
            <div>
                <h3>SSH Configuration</h3>
                <div>
                    <input type="checkbox" checked={use_ssh_keys} onChange={this.handleChangeSSHPreference}/> &nbsp;&nbsp;Enable ssh access into launched instances.
                </div>
                <div>
                    <table className="clearfix table" style={{ tableLayout: "fixed" }}>
                        <thead>
                            <tr>
                                <th style={{ width: "100px"}}>name</th>
                                <th>public key</th>
                                <th style={{ width: "30px"}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            { ssh_keys ? ssh_keys.map(this.renderSSHKeyRow) : [] }
                            <tr>
                                <td>
                                    <a onClick={ this.launchSSHKeyUploadModal.bind(this, profile.get( 'user')) }>
                                        <i className="glyphicon glyphicon-plus" />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h4>Important Notes</h4>
                    <p>Newly added keys are applied to instances launched in the future, and existing instances <em>that are re-deployed</em>. To re-deploy an existing instance, navigate to it, click the Redeploy button, and wait until instance shows "Active" status.</p>
                    <p>Deleting a key from this page means that it will not be applied to instances launched in the future, but <em>the removed key is not automatically removed from existing or re-deployed instances</em> which already have it. If you need to remove an authorized key from an existing instance, please edit /root/.ssh/authorized_keys inside the instance, or contact Atmosphere support for assistance.</p>
                </div>
            </div>
        );
    }

});
