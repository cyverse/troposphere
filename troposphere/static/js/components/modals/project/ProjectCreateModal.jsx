import React from "react";
import ProjectCreateView from "components/common/ProjectCreateView";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";

export default React.createClass({
    displayName: "ProjectCreateModal",

    mixins: [BootstrapModalMixin],

    cancel: function() {
        this.hide();
    },

    confirm: function(name, description, groupOwner) {
        this.hide();
        this.props.onConfirm(name, description, groupOwner);
    },

    render: function() {

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Create Project</h1>
                    </div>
                    <div className="modal-body">
                        <ProjectCreateView cancel={this.cancel} onConfirm={this.confirm} />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
