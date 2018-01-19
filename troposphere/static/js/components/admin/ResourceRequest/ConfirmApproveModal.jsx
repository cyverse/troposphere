import React from "react";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";


const ConfirmApproveModal = React.createClass({
    propTypes: {
        onApprove: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    },
    onCancel() {
        this.hide();
        this.props.onCancel();
    },
    onApprove() {
        this.hide();
        this.props.onApprove();
    },
    mixins: [BootstrapModalMixin],
    render() {
        return (
        <div className="modal fade">
            <div className="modal-dialog" style={{ minWidth: "600px"}}>
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Confirm Request Approval</h1>
                    </div>
                    <div style={{ minHeight: "300px" }} className="modal-body">
                        <div className="alert alert-warning">
                            <p>
                                The user's resources have not been updated!
                            </p>
                        </div>
                        <p>
                           Both quota and allocation must be manually updated.
                        </p>
                        <p>
                            Click cancel if you have not yet updated the user's resources, otherwise click approve anyways.
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button"
                                className="btn"
                                onClick={this.onApprove}>
                            Approve Anyways
                        </button>
                        <button type="button"
                                className="btn btn-primary"
                                onClick={this.onCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
});

export default ConfirmApproveModal;
