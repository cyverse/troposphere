import React from "react";
import ModalHelpers from "components/modals/ModalHelpers";
import SSHKeyUpload from "components/modals/ssh_key/SSHKeyUpload";
import subscribe from "utilities/subscribe";

import stores from "stores";
import globals from "globals";

const SSHConfiguration = React.createClass({

    getInitialState: function() {
        let {ProfileStore, SSHKeyStore} = this.props.subscriptions;
        var profile = ProfileStore.get();
        return {
            displayMoreInfo: false,
            profile: profile,
        };
    },

    updateState: function() {
        this.setState(this.getInitialState());
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

    editSSHKey: function(sshKey) {
        var profile = this.state.profile;
        let props = {
            sshKey: sshKey,
            user: profile.get('user')
        };
        ModalHelpers.renderModal(SSHKeyUpload, props, function() {});

    },
    destroySSHKey: function(sshKey) {

        // EmitChange is responsible for triggering the rerender, which
        // happens after the network request.

        // Optimistically delete the key
        let {SSHKeyStore} = this.props.subscriptions;
        SSHKeyStore.remove(sshKey);
        sshKey.destroy({
            success: function() {
                SSHKeyStore.emitChange();
            },
            error: function() {
                // Re-add the key to store if delete failed
                SSHKeyStore.add(sshKey);
                SSHKeyStore.emitChange();
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

        // Set a key that lexicograhically sorts first by title then by cid.
        // Cannot sort by id, because recently created bootscript has no id
        let key = sshKey.get("name") + sshKey.cid;
        return (
        <tr key={key}>
            <td style={td}>
                {sshKey.get("name")}
            </td>
            <td style={td}>
                {sshKey.get("pub_key").replace(/\n/g, " ")}
            </td>
            <td>
                <a onClick={this.editSSHKey.bind(this, sshKey)}><i className="glyphicon glyphicon-pencil" /></a>{" "}
                <a onClick={this.destroySSHKey.bind(this, sshKey)}><i style={{ color: "crimson" }} className="glyphicon glyphicon-trash" /></a>
            </td>
        </tr>
        );
    },

    render: function() {
        let {SSHKeyStore} = this.props.subscriptions,
            profile = this.state.profile,
            ssh_keys = SSHKeyStore.getAll();

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
                                <th>Name</th>
                                <th style={{ width: "80%" }}>Public Key</th>
                                <th style={{ width: "60px"}}>Actions</th>
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

export default subscribe(SSHConfiguration, ["SSHKeyStore", "ProfileStore"]);
