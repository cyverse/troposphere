import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";
import VolumeCollection from "collections/VolumeCollection";

export default React.createClass({
    displayName: "ExplainInstanceDeleteConditionsModal",

    propTypes: {
        attachedVolumes: React.PropTypes.instanceOf(VolumeCollection)
            .isRequired,
        onConfirm: React.PropTypes.func.isRequired
    },

    mixins: [BootstrapModalMixin],

    confirm: function() {
        this.hide();
        this.props.onConfirm();
    },

    renderAttachedVolumes: function() {
        var volumes = this.props.attachedVolumes;
        return volumes.map(function(v, i) {
            return (
                <li key={i}>
                    <strong>{v.get("name")}</strong>
                </li>
            );
        });
    },

    renderBody: function() {
        return (
            <div role="form">
                <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                        <Glyphicon name="exclamation-sign" />
                        {
                            " It is not advised to delete while volumes are attached"
                        }
                    </div>
                    <p>
                        {`If volumes are being read or written to, instance deletion can corrupt them.
                        Please first detach the volume(s) before deleting this instance`}
                    </p>
                    <p>
                        {
                            "This following volumes are attached to this instance:"
                        }
                    </p>
                    <ul style={{marginBottom: "48px"}}>
                        {this.renderAttachedVolumes()}
                    </ul>
                    <button
                        className="btn btn-danger pull-right"
                        onClick={this.confirm}>
                        <Glyphicon name="exclamation-sign" /> DELETE ANYWAY
                    </button>
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
                            <h1 className="t-title">
                                Instance Delete Conditions
                            </h1>
                        </div>
                        <div className="modal-body">{this.renderBody()}</div>
                        <div className="modal-footer">
                            <RaisedButton
                                default
                                onTouchTap={this.hide}
                                label="Cancel"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
