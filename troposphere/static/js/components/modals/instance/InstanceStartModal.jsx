import React from "react";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";

export default React.createClass({
    displayName: "InstanceStartModal",

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
                <strong>WARNING</strong>
                {' In order to start a stopped instance, you must have sufficient quota and the cloud must have enough room to support your instance\'s size.'}
            </p>
            <p>
                {"Would you like to start this instance?"}
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
                        <h1 className="t-title">Start Instance</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={this.cancel}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={this.confirm}>
                            Yes, start this instance
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
