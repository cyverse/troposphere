import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import Backbone from "backbone";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";

export default React.createClass({
    displayName: "VolumeDeleteModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
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
        var volume = this.props.volume;
        return (
            <div>
                <p>
                    {"Are you sure you want to delete the volume "}
                    <strong>{volume.get("name")}</strong>
                    {"?"}
                </p>
                <p>
                    {"The volume will be destroyed and "}
                    <strong style={{textDecoration: "underline"}}>
                        all data will be permanently lost
                    </strong>
                    {"."}
                </p>
            </div>
        );
    },

    render: function() {
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <h1 className="t-title">Delete Volume</h1>
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
                                label="Yes, delete this volume"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
