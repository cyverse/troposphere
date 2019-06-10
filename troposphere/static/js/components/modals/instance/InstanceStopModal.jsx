import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import AttachedVolumeWarning from "./components/AttachedVolumeWarning";
import stores from "stores";

export default React.createClass({
    displayName: "InstanceStopModal",

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
                        <p>{"Would you like to stop this instance?"}</p>
                        <p>
                            <strong>NOTE:</strong> This will NOT affect your
                            resources. To preserve resources and time allocation
                            you must suspend your instance.
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
                            <h1 className="t-title">Stop Instance</h1>
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
                                    label="Yes, stop this instance"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
