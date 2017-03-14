import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";

export default React.createClass({
    displayName: "InstanceRebootModal",

    mixins: [BootstrapModalMixin],

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function(reboot_type) {
        this.hide();
        this.props.onConfirm(reboot_type);
    },
    confirmReboot: function() {
        this.hide();
        this.props.onConfirm("SOFT");
    },
    confirmHardReboot: function() {
        this.hide();
        this.props.onConfirm("HARD");
    },

    //
    // Render
    // ------
    //

    renderBody: function() {
        return (
        <div>
            <p className="alert alert-warning">
                <Glyphicon name="warning-sign" />
                {" "}
                <strong>WARNING</strong>
                {" Rebooting an instance will cause it to temporarily shut down and become inaccessible during that time."}
            </p>
            <p>
                {"A 'Reboot' will send an 'ACPI Restart' request to the VM that will start the reboot process for your VM."}
            </p>
            <p>
                {"If your VM does not respond to a 'Reboot', there is also the option to send a 'Hard Reboot' which will forcibly restart your VM."}
            </p>
            <p>
                {"Select one of the two options below to reboot your instance."}
            </p>
        </div>
        );
    },

    render: function() {
        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Reboot Instance</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <RaisedButton
                            style={{ marginRight: "10px" }}
                            onTouchTap={this.cancel}
                            label="Cancel"
                        />
                        <RaisedButton
                            style={{ marginRight: "10px" }}
                            primary
                            onTouchTap={this.confirmReboot}
                            label="Reboot"
                        />
                        <RaisedButton
                            primary
                            onTouchTap={this.confirmHardReboot}
                            label="Hard Reboot"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
