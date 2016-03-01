import React from 'react';
import ProjectCreateView from 'components/common/ProjectCreateView.react.js';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';

export default React.createClass({
    displayName: "ProjectCreateModal",

    mixins: [BootstrapModalMixin],

    cancel: function () {
        this.hide();
    },

    confirm: function (name, description) {
        this.hide();
        this.props.onConfirm(name, description);
    },

    render: function () {

        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <strong>Create Project</strong>
                        </div>
                        <div className="modal-body">
                            <ProjectCreateView
                                cancel={this.cancel}
                                onConfirm={this.confirm}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
