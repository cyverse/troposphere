import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";

export default React.createClass({
    displayName: "InstanceRedeployModal",

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
            <p className="alert alert-warning">
                <Glyphicon name="warning-sign" />
                {" "}
                <strong>NOTE</strong>
                {" Redeploying an instance will allow you to fix instances that show up as 'active - deploy_error'. If after executing a 'redeploy' you find that your VM returns to the deploy_error state, please contact support."}
            </p>
            <p>
                {"Would you like to redeploy this instance?"}
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
                        <h1 className="t-title">Redeploy Instance</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <RaisedButton
                            style={{ marginRight: "10xp" }}
                            onTouchTap={this.cancel}
                            label="Cancel"
                        />
                        <RaisedButton
                            primary
                            onTouchTap={this.confirm}
                            label="Yes, Redeploy Instance"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
