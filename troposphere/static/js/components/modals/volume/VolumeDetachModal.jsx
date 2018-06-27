import React from "react";
import Backbone from "backbone";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";

export default React.createClass({
    displayName: "VolumeDetachModal",

    mixins: [BootstrapModalMixin],

    propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        helpLink: React.PropTypes.instanceOf(Backbone.Model).isRequired
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
                <p className="alert alert-danger">
                    <Glyphicon name="warning-sign" />
                    <strong>{"WARNING "}</strong>
                    {`If data is being written to the volume when it's detached, the data may become corrupted. Therefore, ` +
                        `we recommend you make sure there is no data being written to the volume before detaching it.`}
                </p>
                <p>
                    {"Would you like to detach the volume "}
                    <strong>{volume.get("name")}</strong>
                    {"?"}
                </p>
                <p>
                    <a href={this.props.helpLink.get("href")} target="_blank">
                        {"Learn more about unmounting and detaching a volume"}
                    </a>
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
                            <strong>Detach Volume</strong>
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
                                label="Detach Volume"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
