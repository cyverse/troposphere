import Backbone from "backbone";
import React from "react";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import ShowScript from "components/common/boot_script/ShowScript";

import stores from "stores";


export default React.createClass({
    displayName: "ScriptShowModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        script: React.PropTypes.instanceOf(Backbone.Model),
    },



    onClose: function() {
        this.hide();
    },

    renderBody: function() {
        let { script } = this.props;

        return (
            <ShowScript
                script={script}
                footerClassName={"modal-footer"}
                onClose={this.onClose}
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
                        <h1 className="t-title">
                            {"View Deployment Script"}
                        </h1>
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
