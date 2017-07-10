import React from "react";
import GroupCreateView from "components/common/GroupCreateView";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";

export default React.createClass({
    displayName: "GroupEditModal",

    mixins: [BootstrapModalMixin],

    cancel: function() {
        this.hide();
    },

    confirm: function(group_attrs) {
        this.hide();
        this.props.onConfirm(group_attrs);
    },

    render: function() {
        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Edit Group</h1>
                    </div>
                    <div className="modal-body">
                        <GroupCreateView group={this.props.group} cancel={this.cancel} onConfirm={this.confirm} />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
