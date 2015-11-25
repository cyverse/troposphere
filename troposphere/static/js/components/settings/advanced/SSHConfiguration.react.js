import React from 'react';
import ModalHelpers from 'components/modals/ModalHelpers';
import SSHKeyUpload from 'components/modals/SSHKeyUpload.react';
import actions from 'actions';
import modals from 'modals';
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

    destroySSHKey: function(SSHKey) {

        // EmitChange is responsible for triggering the rerender, which
        // happens after the network request.

        // Optimistically delete the key
        stores.SSHKeyStore.remove(SSHKey);
        SSHKey.destroy({
            success: function() {
                stores.SSHKeyStore.emitChange();
            },
            error: function() {
                // Re-add the key to store if delete failed
                stores.SSHKeyStore.add(SSHKey);
                stores.SSHKeyStore.emitChange();
            }
        });
    },

    launchSSHKeyUploadModal: function(user) {
        ModalHelpers.renderModal(SSHKeyUpload, {
            user: user
        }, function() {});
    },

    renderSSHKeyRow: function(SSHKey) {
        return (
            <tr key={ SSHKey.get( 'id') }>
                <td>{ SSHKey.get('name') }</td>
                <td style={{ wordWrap: "break-word" }}>{ SSHKey.get('pub_key').replace(/\n/g, " ") }</td>
                <td>
                    <a onClick={ this.destroySSHKey.bind(this, SSHKey) }>
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
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

});
