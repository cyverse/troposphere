import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";

export default React.createClass({
    displayName: "InstanceUnshelveModal",

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

    //
    // Render
    // ------
    //

    renderBody: function() {
        return (
        <div>
            <p>
                {"Would you like to unshelve this instance?"}
            </p>
            <p>
                Your instance's IP address will have change once it is available.
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
                        <h1 className="t-title">Unshelve Instance</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <RaisedButton
                            style={{ marginRight: "10Px" }}
                            onTouchTap={this.cancel}
                            label="Cancel"
                        />
                        <RaisedButton
                            primary
                            onTouchTap={this.confirm}
                            label="Yes, unshelve this instance"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
