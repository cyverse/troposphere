import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";

export default React.createClass({
    displayName: "ProjectDeleteConditionsModal",

    mixins: [BootstrapModalMixin],

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
    },

    //
    // Render
    // ------
    //

    renderBody: function() {
        return (
        <div role="form">
            <div className="form-group">
                <p className="alert alert-info">
                    <i className="glyphicon glyphicon-info-sign" />
                    <strong> Uh-oh! </strong>
                    {"It looks like you're trying to delete this project. However, we don't currently support " +
                     "deleting projects that have resources in them."}
                </p>
                <p>
                    Before you can delete this project, you first need to
                    either <strong>DELETE</strong> any instances and volumes{" "}
                    <span style={{textDecoration: "underline"}}>or</span>{" "}
                    <strong>MOVE</strong> them into another project.
                </p>
                <p>
                    Once these are removed, you'll be able to delete it.
                </p>
            </div>
        </div>
        );
    },

    render: function() {
        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="t-title">Project Delete Conditions</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <RaisedButton
                            primary
                            onTouchTap={this.confirm}
                            label="OK"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
