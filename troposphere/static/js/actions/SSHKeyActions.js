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
        var sshKey = new SSHKey({
            name,
            pub_key,
            atmo_user
        });

        // Add sshKey optimistically
        Utils.dispatch(SSHKeyConstants.ADD_SSH_KEY, { sshKey })

        sshKey.save().done(function() {
            Utils.dispatch(SSHKeyConstants.UPDATE_SSH_KEY, { sshKey });
        }).fail(function() {
            Utils.dispatch(SSHKeyConstants.REMOVE_SSH_KEY, { sshKey });
        });
        return sshKey;
    },
    update: function(sshKey, newAttributes) {
        let prevAttributes = Object.assign({}, sshKey.attributes);

        sshKey.set(newAttributes);
        Utils.dispatch(SSHKeyConstants.UPDATE_SSH_KEY, { sshKey });
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
