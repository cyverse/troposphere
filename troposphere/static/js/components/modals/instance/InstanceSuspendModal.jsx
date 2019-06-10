import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";
import AttachedVolumeWarning from "./components/AttachedVolumeWarning";
import stores from "stores";

export default React.createClass({
    displayName: "InstanceSuspendModal",

    mixins: [BootstrapModalMixin],

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm();
    },

    attachedVolumes: function() {
        const volumes = stores.VolumeStore.getVolumesAttachedToInstance(
            this.props.instance
        );
        const isAttached = !!volumes.length;
        return {
            volumes,
            isAttached
        };
    },

    //
    // Render
    // ------
    //

    renderBody: function() {
        const {isAttached, volumes} = this.attachedVolumes();
        return (
            <div>
                {isAttached ? (
                    <AttachedVolumeWarning volumes={volumes} />
                ) : (
                    <div>
                        <p className="alert alert-warning">
                            <Glyphicon name="warning-sign" />{" "}
                            <strong>WARNING</strong>
                            {
                                " Suspending an instance will freeze its state, and the IP address may change when you resume the instance."
                            }
                        </p>
                        <p>
                            {
                                "Suspending an instance frees up resources for other users and allows you to safely preserve the state of your instance without imaging. "
                            }
                            {
                                "Your time allocation no longer counts against you in the suspended mode."
                            }
                        </p>
                        <p>
                            {
                                'Your resource usage charts will only reflect the freed resources once the instance\'s state is "suspended."'
                            }
                        </p>
                    </div>
                )}
            </div>
        );
    },

    render: function() {
        const {isAttached} = this.attachedVolumes();
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <h1 className="t-title">Suspend Instance</h1>
                        </div>
                        <div className="modal-body">{this.renderBody()}</div>
                        <div className="modal-footer">
                            <RaisedButton
                                style={{marginRight: "10px"}}
                                onTouchTap={this.cancel}
                                label={"Cancel"}
                            />
                            {isAttached || (
                                <RaisedButton
                                    primary
                                    onTouchTap={this.confirm}
                                    label="Yes, suspend this instance"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
