import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import Backbone from "backbone";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";

export default React.createClass({
    displayName: "ProjectRemoveResourceModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        resources: React.PropTypes.instanceOf(Backbone.Collection).isRequired
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

    renderResource: function(resource) {
        return (
        <li key={resource.id}>
            {resource.get("name")}
        </li>
        );
    },

    renderBody: function() {
        return (
        <div role="form">
            <div className="form-group">
                <label htmlFor="volumeSize">
                    Resources to Remove
                </label>
                <p>
                    The following resources will be removed from the project:
                </p>
                <ul>
                    {this.props.resources.map(this.renderResource)}
                </ul>
            </div>
        </div>
        )
    },

    render: function() {
        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <strong>Remove Resources</strong>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <RaisedButton
                            style={{ marginRight: "10px" }}
                            onTouchTap={this.cancel}
                            label="Cancel"
                        />
                        <RaisedButton
                            primary
                            onTouchTap={this.confirm}
                            disabled={!this.isSubmittable()}
                            label="Remove resources"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
