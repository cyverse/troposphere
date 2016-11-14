import React from "react";
import AccountCreateView from "components/common/AccountCreateView";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";

export default React.createClass({
    displayName: "AccountCreateModal",

    mixins: [BootstrapModalMixin],

    cancel: function() {
        this.hide();
    },

    confirm: function(new_account_attrs) {
        this.hide();
        this.props.onConfirm(new_account_attrs);
    },

    render: function() {

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Create Account</h1>
                    </div>
                    <div className="modal-body">
                        <AccountCreateView cancel={this.cancel} onConfirm={this.confirm} />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
