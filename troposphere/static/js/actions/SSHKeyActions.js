import SSHKeyConstants from "constants/SSHKeyConstants";
import SSHKey from "models/SSHKey";
import Utils from "./Utils";

export default {
    create: function({name, pub_key, atmo_user}) {
        if(!name)
            throw new Error("Missing SSHKey name");
        if(!pub_key)
            throw new Error("Missing SSHKey public key");
        if(!atmo_user)
            throw new Error("Missing SSHKey author");
        var ssh_key = new SSHKey({
            name,
            pub_key,
            atmo_user
        });
        // Add ssh_key optimistically
        Utils.dispatch(SSHKeyConstants.ADD_SSH_KEY, {
            ssh_key: ssh_key
        }, {
            silent: false
        });

        ssh_key.save().done(function() {
            Utils.dispatch(SSHKeyConstants.UPDATE_SSH_KEY, {
                ssh_key: ssh_key
            }, {
                silent: false
            });
        }).fail(function() {
            Utils.dispatch(SSHKeyConstants.REMOVE_SSH_KEY, {
                ssh_key: ssh_key
            }, {
                silent: false
            });
        });
        return ssh_key;
    },
    update: function(sshKey, newAttributes) {
        let prevAttributes = Object.assign({}, sshKey.attributes);

        sshKey.set(newAttributes);
        sshKey.save(newAttributes, {patch: true})
            .done( () => {
                Utils.dispatch(SSHKeyConstants.UPDATE_SSH_KEY, {sshKey});
            })
            .fail(response => {
                Utils.displayError({
                    title: "SSH Key could not be saved",
                    response: response
                });
                sshKey.set(prevAttributes);
                Utils.dispatch(SSHKeyConstants.UPDATE_SSH_KEY, {sshKey});
            });
        return sshKey;
    },
};
