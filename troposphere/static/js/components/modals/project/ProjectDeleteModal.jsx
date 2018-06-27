import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import Backbone from "backbone";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";

export default React.createClass({
    displayName: "ProjectDeleteModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    isSubmittable: function() {
        return true;
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
        this.props.onConfirm();
    },

    //
    // Render
    // ------
    //

    renderBody: function() {
        var project = this.props.project;
        return (
            <p>
                {"Are you sure you want to delete the project "}
                <strong>{project.get("name")}</strong>
                {"?"}
            </p>
        );
    },

    render: function() {
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <h1 className="t-title">Delete Project</h1>
                        </div>
                        <div className="modal-body">{this.renderBody()}</div>
                        <div className="modal-footer">
                            <RaisedButton
                                style={{marginRight: "10px"}}
                                onTouchTap={this.cancel}
                                label="Cancel"
                            />
                            <RaisedButton
                                primary
                                onTouchTap={this.confirm}
                                disabled={!this.isSubmittable()}
                                label="Yes, delete the project"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
