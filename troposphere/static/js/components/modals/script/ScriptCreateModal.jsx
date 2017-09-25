import Backbone from "backbone";
import React from "react";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import EditScript from "components/common/boot_script/EditScript";

export default React.createClass({
    displayName: "ScriptCreateModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        script: React.PropTypes.instanceOf(Backbone.Model),
    },

    onScriptChanged: function() {
        this.hide();
    },
    onClose: function() {
        this.hide();
    },

    renderBody: function() {

        return (
            <EditScript
                script={this.props.script}
                footerClassName={"modal-footer"}
                onClose={this.onClose}
                onScriptChanged={this.onScriptChanged}
            />
        );
    },

    render: function() {
        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">{(this.props.script) ? "Update Deployment Script" : "Add a new Deployment Script"}</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
