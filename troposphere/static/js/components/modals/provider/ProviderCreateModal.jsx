import React from "react";
import ProviderCreateView from "components/common/ProviderCreateView";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";

export default React.createClass({
    displayName: "ProviderCreateModal",

    mixins: [BootstrapModalMixin],

    cancel: function() {
        this.hide();
    },

    confirm: function(provider_attrs) {
        this.hide();
        this.props.onConfirm(provider_attrs);
    },

    render: function() {

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Create Provider</h1>
                    </div>
                    <div className="modal-body">
                        <ProviderCreateView cancel={this.cancel} onConfirm={this.confirm} />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
