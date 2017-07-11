import React from "react";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import actions from "actions";

export default React.createClass({

    propTypes: {
        sshKey: React.PropTypes.instanceOf(Backbone.Model),
        user: React.PropTypes.number.isRequired
    },

    getInitialState: function() {
        let { sshKey } = this.props;
        if(sshKey) {
            return {
                keyName: sshKey.get("name"),
                pubKey: sshKey.get("pub_key"),
                errorMsg: ""
            }
        }
        return {
            keyName: "",
            pubKey: "",
            errorMsg: "",
        }
    },

    mixins: [BootstrapModalMixin],

    updateKeyName: function(event) {
        this.setState({
            "keyName": event.target.value
        });
    },

    updatePublicKey: function(event) {
        let rawKey = event.target.value;

        // Trim the key prior to validation, because leading/trailing ws is ignored
        let key = rawKey.trim();
        let parts = key.split(/\s+/g);
        let err = "";

        if (!this.validateKeyType(parts[0])) {
            err = "Public key must begin with either ssh-rsa, ssh-dss, ecdsa-sha2-nistp256, or ssh-ed25519";
        } else if (!this.validateOneLine(key)) {
            err = "Public key cannot contain line breaks";
        } else if (!this.validateNumOfParts(key)) {
            err = "Public key can only contain 2 or 3 parts";
        } else if (!this.validateKeyBodyBase64(parts[1])) {
            err = "The key contains illegal characters";
        }

        this.setState({
            "pubKey": rawKey,
            "errorMsg": err
        });
    },

    validateKeyType: function(firstWord) {
        // Worth noting that `ssh-keygen -t dsa` creates a key beginning with `ssh-dss`
        return /^(ssh-dss|ecdsa-sha2-nistp256|ssh-ed25519|ssh-rsa)$/.test(firstWord);
    },

    validateOneLine: function(key) {
        return /^[^\n]*$/.test(key);
    },

    validateNumOfParts: function(key) {
        // Key must be space delimited
        let parts = key.split(/ +/);

        // 3 parts if a comment is included
        return parts.length == 2 || parts.length == 3;
    },

    validateKeyBodyBase64: function(secondPart) {
        return /^[a-zA-Z0-9+/=]+$/.test(secondPart);
    },

    validateKey: function() {
        // Trim the key prior to validation, because leading/trailing ws is ignored
        let key = this.state.pubKey.trim();
        let parts = key.split(/\s+/g);

        return this.validateKeyType(parts[0]) &&
        this.validateNumOfParts(key) &&
        this.validateOneLine(key) &&
        this.validateKeyBodyBase64(parts[1]);
    },

    isSubmittable() {
        return this.validateKey() && this.state.keyName.length > 0;
    },

    onSubmit: function() {
        let attributes = {
            name: this.state.keyName.trim(),
            pub_key: this.state.pubKey.trim(),
            atmo_user: this.props.user
        };
        let { sshKey } = this.props;

        if (sshKey) {
            actions.SSHKeyActions.update(sshKey, attributes);
        } else {
            actions.SSHKeyActions.create(attributes);
        }

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
                        <h1 className="t-title">{(this.props.sshKey) ? "Update public SSH key": "Add a public SSH key"}</h1>
                    </div>
                    <div style={{ minHeight: "300px" }} className="modal-body">
                        <div className="form-group">
                            <label className="control-label">
                                Key Name
                            </label>
                            <div>
                                <input type="text" className="form-control" onChange={this.updateKeyName} value={this.state.keyName} />
                            </div>
                        </div>
                        <div>
                            <label className="control-label">
                                Public Key
                            </label>
                            <div aria-invalid={showKeyWarn} className={"form-group " + (showKeyWarn ? "has-error" : "")}>
                                <textarea placeholder="Begins with either ssh-rsa, ssh-dss, ..."
                                    style={{ minHeight: "200px" }}
                                    className="form-control"
                                    onChange={this.updatePublicKey} value={this.state.pubKey} />
                                {showKeyWarn ? <span className="help-block">{"* " + this.state.errorMsg}</span> : ""}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={this.hide}>
                            Cancel
                        </button>
                        <button type="button"
                            aria-invalid={notSubmittable}
                            className="btn btn-primary"
                            onClick={this.onSubmit}
                            disabled={notSubmittable}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }

});
