import React from "react";
import ModalHelpers from "components/modals/ModalHelpers";
import SSHKeyUpload from "components/modals/SSHKeyUpload";
import stores from "stores";

import globals from "globals";

export default React.createClass({

    getInitialState: function() {
        var profile = stores.ProfileStore.get();
        return {
            displayMoreInfo: false,
            profile: profile,
            ssh_keys: stores.SSHKeyStore.getAll(),
        };
    },

    updateState: function() {
        this.setState(this.getInitialState());
    },

    componentDidMount: function() {
        stores.ProfileStore.addChangeListener(this.updateState);
        stores.SSHKeyStore.addChangeListener(this.updateState);
    },

    onDisplayMoreInfo(e) {
        e.preventDefault();
        this.setState({
            displayMoreInfo: true
        });
    },

    renderSupportLink() {
        return (
            <a href={ `mailto:${globals.SUPPORT_EMAIL}` }>{ ` ${globals.SUPPORT_EMAIL} ` }</a>
        );
    },

    renderMoreInfo() {
        var displayMoreInfo = this.state.displayMoreInfo;

        if (displayMoreInfo) {
            return (
            <div>
                <p>
                   Changes do not immediately affect existing instances.  A
                   suspended instance must be resumed to receive the new keys.
                   An active instance must be re-deployed.
                </p>
                <p>
                   Removing a key from this list doesn't remove it from any existing
                   instances. If you need to remove a key from an existing
                   instance, please edit /root/.ssh/authorized_keys inside the
                   instance, or contact Atmosphere support at
                   { this.renderSupportLink() } for assistance.
                </p>
            </div>
            )
        }

        return (
        <p>
            Click <a onClick={this.onDisplayMoreInfo}>here</a> to learn more.
        </p>
        )
    },

    componentWillUnmount: function() {
        stores.ProfileStore.removeChangeListener(this.updateState);
        stores.SSHKeyStore.removeChangeListener(this.updateState);
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

    style() {
        return {
            td: {
                wordWrap: "break-word",
                whiteSpace: "normal"
            }
        }
    },

    renderSSHKeyRow: function(sshKey) {
        let { td } = this.style();
        return (
        <tr key={sshKey.get("id")}>
            <td style={td}>
                {sshKey.get("name")}
            </td>
            <td style={td}>
                {sshKey.get("pub_key").replace(/\n/g, " ")}
            </td>
            <td>
                <a onClick={this.destroySSHKey.bind(this, sshKey)}><i style={{ color: "crimson" }} className="glyphicon glyphicon-trash" /></a>
            </td>
        </tr>
        );
    },

    render: function() {
        var profile = this.state.profile;
        var ssh_keys = this.state.ssh_keys;

        return (
            <div>
                <h3>SSH Configuration</h3>
                <div style={{maxWidth: "600px"}}>
                    <p>
                        Use the table below to list SSH keys that you would
                        like to be present when you launch an instance.
                    </p>
                    {  this.renderMoreInfo() }
                </div>
                <div style={{maxWidth: "80%"}}>
                    <table className="clearfix table" style={{ tableLayout: "fixed" }}>
                        <thead>
                            <tr>
                                <th style={{ width: "100px"}}>Name</th>
                                <th>Public Key</th>
                                <th style={{ width: "30px"}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            { ssh_keys ? ssh_keys.map(this.renderSSHKeyRow) : [] }
                            <tr>
                                <td>
                                    <a onClick={ this.launchSSHKeyUploadModal.bind(this, profile.get("user")) }>
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
