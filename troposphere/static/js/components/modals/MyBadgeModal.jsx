import React from "react";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";


function getState() {
    return {
        badge: null
    }
}

export default React.createClass({
    displayName: "MyBadgeModal",

    mixins: [BootstrapModalMixin],

    //
    // Mounting & State
    // ----------------
    //
    getInitialState: function() {
        return getState();
    },

    updateState: function() {
        if (this.isMounted()) this.setState(getState());
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm(this.state.badge);
    },

    render: function() {
        var content = (
        <div>
            <img className="badge-modal-image" src={this.props.badge.get("imageUrl")} />
            <p>
                {this.props.badge.get("strapline")}
            </p>
        </div>
        );

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content badge-modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title-1">{this.props.badge.get("name")}</h1>
                    </div>
                    <div className="modal-body">
                        {content}
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
