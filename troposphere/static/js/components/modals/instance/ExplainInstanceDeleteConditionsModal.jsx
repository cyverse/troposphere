import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import Glyphicon from "components/common/Glyphicon";
import VolumeCollection from "collections/VolumeCollection";

export default React.createClass({
    displayName: "ExplainInstanceDeleteConditionsModal",

    propTypes: {
        attachedVolumes: React.PropTypes.instanceOf(VolumeCollection).isRequired,
        onConfirm: React.PropTypes.func.isRequired,
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
            )
        });
    },

    renderBody: function() {
        return (
        <div role="form">
            <div className="form-group">
                <div className="alert alert-danger" role="alert">
                    <Glyphicon name="exclamation-sign" />
                    {" Cannot delete while volumes are attached."}
                </div>
                <p>
                    {"This instance currently has the following volumes attached to it:"}
                </p>
                <ul>
                    {this.renderAttachedVolumes()}
                </ul>
                <p>
                    {"Detach the above volumes to safely delete this instance. " +
                     "If volumes are being read or written to, instance deletion can corrupt volumes. "}
                    <a style={{ color: "black", textDecoration: "underline" }} onClick={this.confirm}>Delete anyway</a>.
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
                        <h1 className="t-title">Instance Delete Conditions</h1>
                    </div>
                    <div className="modal-body">
                        {this.renderBody()}
                    </div>
                    <div className="modal-footer">
                        <RaisedButton
                            primary
                            onTouchTap={this.hide}
                            label="Okay"
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
